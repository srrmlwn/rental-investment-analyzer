import axios from 'axios';
import { parse } from 'csv-parse/sync';
import { LocationRepository } from '../../repositories/locationRepository';
import { MarketDataRepository } from '../../repositories/marketDataRepository';
import { MarketDataType } from '../../models/types';

export class MarketDataImporter {
  private readonly locationRepo: LocationRepository;
  private readonly marketDataRepo: MarketDataRepository;

  constructor() {
    this.locationRepo = new LocationRepository();
    this.marketDataRepo = new MarketDataRepository();
  }

  async importHudRentalRates(): Promise<void> {
    try {
      // 1. Download HUD data
      const response = await axios.get(process.env.HUD_RENTAL_RATES_URL || '', {
        responseType: 'text',
      });

      // 2. Parse CSV data
      const records = parse(response.data, {
        columns: true,
        skip_empty_lines: true,
      });

      // 3. Process and import data
      for (const record of records) {
        const location = await this.getOrCreateLocation(record);
        if (!location) continue;

        await this.marketDataRepo.create({
          locationId: location.id,
          dataType: 'rental_rate',
          value: parseFloat(record.fmr),
          year: parseInt(record.year),
          month: parseInt(record.month),
          source: 'HUD Fair Market Rents',
        });
      }

      console.log('Successfully imported HUD rental rates');
    } catch (error) {
      console.error('Error importing HUD rental rates:', error);
      throw new Error('Failed to import HUD rental rates');
    }
  }

  async importFhfaPropertyValues(): Promise<void> {
    try {
      // 1. Download FHFA data
      const response = await axios.get(process.env.FHFA_PROPERTY_VALUES_URL || '', {
        responseType: 'text',
      });

      // 2. Parse CSV data
      const records = parse(response.data, {
        columns: true,
        skip_empty_lines: true,
      });

      // 3. Process and import data
      for (const record of records) {
        const location = await this.getOrCreateLocation(record);
        if (!location) continue;

        await this.marketDataRepo.create({
          locationId: location.id,
          dataType: 'property_value',
          value: parseFloat(record.index),
          year: parseInt(record.year),
          month: parseInt(record.quarter) * 3, // Convert quarter to month
          source: 'FHFA House Price Index',
        });
      }

      console.log('Successfully imported FHFA property values');
    } catch (error) {
      console.error('Error importing FHFA property values:', error);
      throw new Error('Failed to import FHFA property values');
    }
  }

  private async getOrCreateLocation(record: any): Promise<{ id: number } | null> {
    try {
      const city = record.city || record.metro;
      const state = record.state;
      const zipCode = record.zipCode;

      if (!city || !state) {
        console.warn('Missing city or state in record:', record);
        return null;
      }

      let location = await this.locationRepo.findByCityState(city, state);
      if (!location) {
        location = await this.locationRepo.create({
          city,
          state,
          zipCode,
        });
      }

      return { id: location.id };
    } catch (error) {
      console.error('Error processing location:', error);
      return null;
    }
  }
}

// CLI entry point
if (require.main === module) {
  const importer = new MarketDataImporter();
  const importType = process.argv[2];

  async function runImport() {
    try {
      if (importType === 'hud') {
        await importer.importHudRentalRates();
      } else if (importType === 'fhfa') {
        await importer.importFhfaPropertyValues();
      } else {
        console.error('Please specify import type: hud or fhfa');
        process.exit(1);
      }
    } catch (error) {
      console.error('Import failed:', error);
      process.exit(1);
    }
  }

  runImport();
} 