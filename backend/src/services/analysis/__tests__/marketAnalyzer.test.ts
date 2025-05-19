import { StandardMarketAnalyzer } from '../marketAnalyzer';
import { MarketData } from '../../../models/types';

describe('StandardMarketAnalyzer', () => {
  let analyzer: StandardMarketAnalyzer;

  beforeEach(() => {
    analyzer = new StandardMarketAnalyzer();
  });

  describe('analyzeLocation', () => {
    it('should analyze San Francisco market data correctly', async () => {
      const analysis = await analyzer.analyzeLocation(1);

      expect(analysis.locationId).toBe(1);
      expect(analysis.city).toBe('San Francisco');
      expect(analysis.state).toBe('CA');
      expect(analysis.rentalRates).toHaveLength(6);
      expect(analysis.propertyValues).toHaveLength(6);

      // Test metrics calculations
      expect(analysis.metrics.averageRentalRate).toBeCloseTo(3375, 0);
      expect(analysis.metrics.averagePropertyValue).toBeCloseTo(1150000, 0);
      expect(analysis.metrics.capRate).toBeCloseTo(3.52, 2); // (3375 * 12) / 1150000 * 100
      expect(analysis.metrics.priceToRentRatio).toBeCloseTo(28.4, 1); // 1150000 / (3375 * 12)
      expect(analysis.metrics.rentalYield).toBeCloseTo(3.52, 2); // Same as cap rate in this case

      // Test trends
      expect(analysis.metrics.monthlyTrend.rentalRateChange).toBeCloseTo(1.45, 2); // (3500 - 3450) / 3450 * 100
      expect(analysis.metrics.monthlyTrend.propertyValueChange).toBeCloseTo(1.69, 2); // (1200000 - 1180000) / 1180000 * 100
      expect(analysis.metrics.annualTrend.rentalRateChange).toBeCloseTo(7.69, 2); // (3500 - 3250) / 3250 * 100
      expect(analysis.metrics.annualTrend.propertyValueChange).toBeCloseTo(9.09, 2); // (1200000 - 1100000) / 1100000 * 100
    });

    it('should analyze Oakland market data correctly', async () => {
      const analysis = await analyzer.analyzeLocation(2);

      expect(analysis.locationId).toBe(2);
      expect(analysis.city).toBe('Oakland');
      expect(analysis.state).toBe('CA');
      expect(analysis.rentalRates).toHaveLength(6);
      expect(analysis.propertyValues).toHaveLength(6);

      // Test metrics calculations
      expect(analysis.metrics.averageRentalRate).toBeCloseTo(2666.67, 0);
      expect(analysis.metrics.averagePropertyValue).toBeCloseTo(800000, 0);
      expect(analysis.metrics.capRate).toBeCloseTo(4.0, 2); // (2666.67 * 12) / 800000 * 100
      expect(analysis.metrics.priceToRentRatio).toBeCloseTo(25.0, 1); // 800000 / (2666.67 * 12)
      expect(analysis.metrics.rentalYield).toBeCloseTo(4.0, 2); // Same as cap rate in this case

      // Test trends
      expect(analysis.metrics.monthlyTrend.rentalRateChange).toBeCloseTo(1.82, 2); // (2800 - 2750) / 2750 * 100
      expect(analysis.metrics.monthlyTrend.propertyValueChange).toBeCloseTo(2.41, 2); // (850000 - 830000) / 830000 * 100
      expect(analysis.metrics.annualTrend.rentalRateChange).toBeCloseTo(9.80, 2); // (2800 - 2550) / 2550 * 100
      expect(analysis.metrics.annualTrend.propertyValueChange).toBeCloseTo(13.33, 2); // (850000 - 750000) / 750000 * 100
    });

    it('should throw error for non-existent location', async () => {
      await expect(analyzer.analyzeLocation(999)).rejects.toThrow('Location 999 not found in test data');
    });
  });
}); 