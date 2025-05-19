import { MarketData, MarketDataType } from '../../models/types';
import testData from '../../data/test/marketData.json';

export interface MarketMetrics {
  averageRentalRate: number;
  averagePropertyValue: number;
  capRate: number;
  priceToRentRatio: number;
  rentalYield: number;
  monthlyTrend: {
    rentalRateChange: number;
    propertyValueChange: number;
  };
  annualTrend: {
    rentalRateChange: number;
    propertyValueChange: number;
  };
}

export interface MarketAnalysis {
  locationId: number;
  city: string;
  state: string;
  metrics: MarketMetrics;
  rentalRates: MarketData[];
  propertyValues: MarketData[];
  lastUpdated: Date;
}

export interface MarketAnalyzer {
  analyzeLocation(locationId: number): Promise<MarketAnalysis>;
}

export class StandardMarketAnalyzer implements MarketAnalyzer {
  private getTestData(locationId: number, dataType: MarketDataType): MarketData[] {
    const data = dataType === 'rental_rate' ? testData.rentalRates : testData.propertyValues;
    const locationData = data.find(loc => loc.locationId === locationId);
    
    if (!locationData) {
      throw new Error(`No ${dataType} data found for location ${locationId}`);
    }

    return locationData.data.map(item => ({
      id: 0, // Not relevant for test data
      locationId,
      dataType,
      value: item.value,
      year: item.year,
      month: item.month,
      source: 'test_data',
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  }

  private calculateMarketMetrics(
    rentalRates: MarketData[],
    propertyValues: MarketData[]
  ): MarketMetrics {
    // Sort data by date (newest first)
    const sortedRentalRates = [...rentalRates].sort((a, b) => 
      (b.year * 12 + (b.month || 0)) - (a.year * 12 + (a.month || 0))
    );
    const sortedPropertyValues = [...propertyValues].sort((a, b) => 
      (b.year * 12 + (b.month || 0)) - (a.year * 12 + (a.month || 0))
    );

    // Calculate averages
    const averageRentalRate = sortedRentalRates.reduce((sum, data) => sum + data.value, 0) / sortedRentalRates.length;
    const averagePropertyValue = sortedPropertyValues.reduce((sum, data) => sum + data.value, 0) / sortedPropertyValues.length;

    // Calculate monthly trends (comparing last two months)
    const monthlyRentalRateChange = sortedRentalRates.length >= 2 
      ? ((sortedRentalRates[0].value - sortedRentalRates[1].value) / sortedRentalRates[1].value) * 100
      : 0;
    const monthlyPropertyValueChange = sortedPropertyValues.length >= 2
      ? ((sortedPropertyValues[0].value - sortedPropertyValues[1].value) / sortedPropertyValues[1].value) * 100
      : 0;

    // Calculate annual trends (comparing first and last month in dataset)
    const annualRentalRateChange = sortedRentalRates.length >= 2
      ? ((sortedRentalRates[0].value - sortedRentalRates[sortedRentalRates.length - 1].value) / 
         sortedRentalRates[sortedRentalRates.length - 1].value) * 100
      : 0;
    const annualPropertyValueChange = sortedPropertyValues.length >= 2
      ? ((sortedPropertyValues[0].value - sortedPropertyValues[sortedPropertyValues.length - 1].value) / 
         sortedPropertyValues[sortedPropertyValues.length - 1].value) * 100
      : 0;

    // Calculate investment metrics
    const annualRentalIncome = averageRentalRate * 12;
    const capRate = (annualRentalIncome / averagePropertyValue) * 100;
    const priceToRentRatio = averagePropertyValue / (averageRentalRate * 12);
    const rentalYield = (annualRentalIncome / averagePropertyValue) * 100;

    return {
      averageRentalRate,
      averagePropertyValue,
      capRate,
      priceToRentRatio,
      rentalYield,
      monthlyTrend: {
        rentalRateChange: monthlyRentalRateChange,
        propertyValueChange: monthlyPropertyValueChange
      },
      annualTrend: {
        rentalRateChange: annualRentalRateChange,
        propertyValueChange: annualPropertyValueChange
      }
    };
  }

  async analyzeLocation(locationId: number): Promise<MarketAnalysis> {
    try {
      // Get test data for the location
      const rentalRates = this.getTestData(locationId, 'rental_rate');
      const propertyValues = this.getTestData(locationId, 'property_value');

      // Get location info from test data
      const locationInfo = testData.rentalRates.find(loc => loc.locationId === locationId);
      if (!locationInfo) {
        throw new Error(`Location ${locationId} not found in test data`);
      }

      // Calculate market metrics
      const metrics = this.calculateMarketMetrics(rentalRates, propertyValues);

      return {
        locationId,
        city: locationInfo.city,
        state: locationInfo.state,
        metrics,
        rentalRates,
        propertyValues,
        lastUpdated: new Date()
      };
    } catch (error: unknown) {
      console.error('Error analyzing location:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to analyze location ${locationId}: ${errorMessage}`);
    }
  }
} 