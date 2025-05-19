import request from 'supertest';
import { app } from '../../index';
import { MarketDataRepository } from '../../repositories/marketDataRepository';
import { PropertyRepository } from '../../repositories/propertyRepository';
import { LocationRepository } from '../../repositories/locationRepository';

describe('Analysis API', () => {
  let marketDataRepo: MarketDataRepository;
  let propertyRepo: PropertyRepository;
  let locationRepo: LocationRepository;

  beforeEach(() => {
    marketDataRepo = new MarketDataRepository();
    propertyRepo = new PropertyRepository();
    locationRepo = new LocationRepository();
  });

  describe('POST /api/v1/analysis/calculate', () => {
    it('calculates analysis for valid input', async () => {
      // Create test location
      const location = await locationRepo.create({
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105'
      });

      // Create test property
      const property = await propertyRepo.create({
        locationId: location.id,
        address: '123 Test St',
        price: 1000000,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        propertyType: 'single_family',
        listingSource: 'test',
        listingUrl: 'http://test.com'
      });

      // Create test market data
      await marketDataRepo.create({
        locationId: location.id,
        dataType: 'rental_rate',
        value: 3500,
        year: 2023,
        month: 12,
        source: 'test'
      });

      await marketDataRepo.create({
        locationId: location.id,
        dataType: 'property_value',
        value: 1000000,
        year: 2023,
        month: 12,
        source: 'test'
      });

      const response = await request(app)
        .post('/api/v1/analysis/calculate')
        .send({
          propertyId: property.id,
          analysisParams: {
            downPayment: 200000,
            interestRate: 4.5,
            loanTerm: 30,
            operatingExpenses: {
              propertyTax: 12000,
              insurance: 1200,
              maintenance: 2400,
              management: 1800,
              hoa: 0,
              utilities: 0,
              vacancy: 1800
            }
          }
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('property');
      expect(response.body).toHaveProperty('marketAnalysis');
      expect(response.body).toHaveProperty('cashFlow');
      expect(response.body.cashFlow).toHaveProperty('monthlyCashFlow');
      expect(response.body.cashFlow).toHaveProperty('annualCashFlow');
      expect(response.body.cashFlow).toHaveProperty('cashOnCashReturn');
    });

    it('handles invalid property ID', async () => {
      const response = await request(app)
        .post('/api/v1/analysis/calculate')
        .send({
          propertyId: 999999,
          analysisParams: {
            downPayment: 200000,
            interestRate: 4.5,
            loanTerm: 30,
            operatingExpenses: {
              propertyTax: 12000,
              insurance: 1200,
              maintenance: 2400,
              management: 1800,
              hoa: 0,
              utilities: 0,
              vacancy: 1800
            }
          }
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('validates required analysis parameters', async () => {
      const response = await request(app)
        .post('/api/v1/analysis/calculate')
        .send({
          propertyId: 1,
          analysisParams: {
            // Missing required parameters
            downPayment: 200000
          }
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
}); 