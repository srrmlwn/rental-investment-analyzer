// import { MarketData, MarketDataType } from '../../models/types';
import testData from '../../data/test/marketData.json';

export enum MarketDataType {
  RENTAL_RATES = 'rental_rate',
  PROPERTY_VALUES = 'property_value'
}

export interface MarketData {
  id: number;
  locationId: string;
  dataType: MarketDataType;
  value: number;
  year: number;
  month: number;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketMetrics {
  averageRentalRate: number;
  averagePropertyValue: number;
  capRate: number;
  cashOnCashReturn: number;
  rentalYield: number;
  priceToRentRatio: number;
  rentalRateTrend: number;
  propertyValueTrend: number;
}

export interface MarketAnalysis {
  locationId: string;
  metrics: MarketMetrics;
  lastUpdated: Date;
}

export interface MarketAnalyzer {
  analyzeLocation(locationId: string): Promise<MarketAnalysis>;
}

export class StandardMarketAnalyzer implements MarketAnalyzer {
  async analyzeLocation(locationId: string): Promise<MarketAnalysis> {
    try {
      // Get test data for the location
      const rentalRates = this.getTestData(locationId, MarketDataType.RENTAL_RATES);
      const propertyValues = this.getTestData(locationId, MarketDataType.PROPERTY_VALUES);

      // Calculate market metrics
      const metrics = this.calculateMarketMetrics(rentalRates, propertyValues);

      return {
        locationId,
        metrics,
        lastUpdated: new Date()
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to analyze location ${locationId}: ${errorMessage}`);
    }
  }

  private getTestData(locationId: string, dataType: MarketDataType): MarketData[] {
    // For MVP, we'll use test data
    const testData = require('../../data/test/marketData.json');
    const locationData = testData[locationId];
    
    if (!locationData) {
      throw new Error(`No test data available for location ${locationId}`);
    }

    return dataType === MarketDataType.RENTAL_RATES 
      ? locationData.rentalRates 
      : locationData.propertyValues;
  }

  private calculateMarketMetrics(rentalRates: MarketData[], propertyValues: MarketData[]): MarketMetrics {
    const avgRentalRate = this.calculateAverage(rentalRates.map(r => r.value));
    const avgPropertyValue = this.calculateAverage(propertyValues.map(p => p.value));
    
    // Calculate trends (simple linear regression)
    const rentalRateTrend = this.calculateTrend(rentalRates);
    const propertyValueTrend = this.calculateTrend(propertyValues);

    // Calculate annual metrics
    const annualRent = avgRentalRate * 12;
    const capRate = (annualRent / avgPropertyValue) * 100;
    const priceToRentRatio = avgPropertyValue / annualRent;
    const rentalYield = (annualRent / avgPropertyValue) * 100;

    // For MVP, we'll use a simplified cash-on-cash return calculation
    // assuming 20% down payment and 4% interest rate
    const downPayment = avgPropertyValue * 0.2;
    const annualMortgage = (avgPropertyValue - downPayment) * 0.04;
    const annualExpenses = annualRent * 0.3; // Assuming 30% expenses
    const annualCashFlow = annualRent - annualMortgage - annualExpenses;
    const cashOnCashReturn = (annualCashFlow / downPayment) * 100;

    return {
      averageRentalRate: avgRentalRate,
      averagePropertyValue: avgPropertyValue,
      capRate,
      cashOnCashReturn,
      rentalYield,
      priceToRentRatio,
      rentalRateTrend,
      propertyValueTrend
    };
  }

  private calculateAverage(values: number[]): number {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private calculateTrend(data: MarketData[]): number {
    if (data.length < 2) return 0;

    const sortedData = [...data].sort((a, b) => 
      (a.year * 12 + a.month) - (b.year * 12 + b.month)
    );

    const x = sortedData.map((_, i) => i);
    const y = sortedData.map(d => d.value);

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope; // This represents the monthly change
  }
} 