import { BaseRepository } from './baseRepository';
import { MarketData, MarketDataRow, MarketDataType, toMarketData } from '../models/types';

export class MarketDataRepository extends BaseRepository<MarketData, MarketDataRow> {
  constructor() {
    super('market_data');
  }

  protected toModel(row: MarketDataRow): MarketData {
    return toMarketData(row);
  }

  async getLatestRentalRates(locationId: number): Promise<MarketData[]> {
    const result = await this.query(
      `SELECT DISTINCT ON (year, month) *
       FROM market_data
       WHERE location_id = $1 AND data_type = 'rental_rate'
       ORDER BY year DESC, month DESC NULLS LAST`,
      [locationId]
    );
    return result.rows.map(this.toModel);
  }

  async getLatestPropertyValues(locationId: number): Promise<MarketData[]> {
    const result = await this.query(
      `SELECT DISTINCT ON (year, month) *
       FROM market_data
       WHERE location_id = $1 AND data_type = 'property_value'
       ORDER BY year DESC, month DESC NULLS LAST`,
      [locationId]
    );
    return result.rows.map(this.toModel);
  }

  async getDataByTypeAndYear(
    locationId: number,
    dataType: MarketDataType,
    year: number
  ): Promise<MarketData[]> {
    const result = await this.query(
      `SELECT * FROM market_data
       WHERE location_id = $1 AND data_type = $2 AND year = $3
       ORDER BY month ASC NULLS FIRST`,
      [locationId, dataType, year]
    );
    return result.rows.map(this.toModel);
  }

  async create(data: Omit<MarketData, 'id' | 'createdAt' | 'updatedAt'>): Promise<MarketData> {
    const result = await this.query(
      `INSERT INTO market_data (
        location_id, data_type, value, year, month, source
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        data.locationId,
        data.dataType,
        data.value,
        data.year,
        data.month,
        data.source,
      ]
    );
    return this.toModel(result.rows[0]);
  }

  async update(id: number, data: Partial<Omit<MarketData, 'id' | 'createdAt' | 'updatedAt'>>): Promise<MarketData | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    const fields = {
      locationId: 'location_id',
      dataType: 'data_type',
      value: 'value',
      year: 'year',
      month: 'month',
      source: 'source',
    };

    for (const [key, dbKey] of Object.entries(fields)) {
      const value = (data as any)[key];
      if (value !== undefined) {
        updates.push(`${dbKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await this.query(
      `UPDATE market_data
       SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0] ? this.toModel(result.rows[0]) : null;
  }
} 