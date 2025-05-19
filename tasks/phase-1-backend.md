# Phase 1: Backend Core (MVP)

## Overview
This phase focuses on implementing the core backend functionality for the rental property investment analyzer. The goal is to create a robust API that can handle property data, market analysis, and investment calculations.

## Dependencies
- Node.js/Express backend (from Phase 0)
- PostgreSQL database (from Phase 0)
- RapidAPI account for property listings
- HUD Fair Market Rents data
- FHFA House Price Index data

## Tasks

### 1.1 Database Setup

#### Database Schema
- [ ] Create migrations for core tables
  ```sql
  -- locations table
  CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(city, state, zip_code)
  );

  -- properties table
  CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES locations(id),
    address TEXT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    bedrooms INTEGER,
    bathrooms DECIMAL(4,2),
    square_feet INTEGER,
    year_built INTEGER,
    property_type VARCHAR(50),
    listing_source VARCHAR(50),
    listing_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  -- market_data table
  CREATE TABLE market_data (
    id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES locations(id),
    data_type VARCHAR(50) NOT NULL, -- 'rental_rate', 'property_value', etc.
    value DECIMAL(12,2) NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER,
    source VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(location_id, data_type, year, month)
  );

  -- analysis_results table
  CREATE TABLE analysis_results (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id),
    analysis_type VARCHAR(50) NOT NULL,
    input_data JSONB NOT NULL,
    results JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  ```

#### Data Models
- [ ] Create TypeScript interfaces
  ```typescript
  // backend/src/models/types.ts
  interface Location {
    id: number;
    city: string;
    state: string;
    zipCode?: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface Property {
    id: number;
    locationId: number;
    address: string;
    price: number;
    bedrooms?: number;
    bathrooms?: number;
    squareFeet?: number;
    yearBuilt?: number;
    propertyType?: string;
    listingSource: string;
    listingUrl?: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface MarketData {
    id: number;
    locationId: number;
    dataType: 'rental_rate' | 'property_value';
    value: number;
    year: number;
    month?: number;
    source: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface AnalysisResult {
    id: number;
    propertyId: number;
    analysisType: string;
    inputData: Record<string, any>;
    results: Record<string, any>;
    createdAt: Date;
  }
  ```

#### Database Access Layer
- [ ] Create database repositories
  ```typescript
  // backend/src/repositories/locationRepository.ts
  class LocationRepository {
    async findByCityState(city: string, state: string): Promise<Location | null>;
    async findByZipCode(zipCode: string): Promise<Location | null>;
    async create(location: Omit<Location, 'id'>): Promise<Location>;
  }

  // backend/src/repositories/propertyRepository.ts
  class PropertyRepository {
    async findByLocation(locationId: number): Promise<Property[]>;
    async create(property: Omit<Property, 'id'>): Promise<Property>;
    async update(id: number, property: Partial<Property>): Promise<Property>;
  }

  // backend/src/repositories/marketDataRepository.ts
  class MarketDataRepository {
    async getLatestRentalRates(locationId: number): Promise<MarketData[]>;
    async getLatestPropertyValues(locationId: number): Promise<MarketData[]>;
    async create(data: Omit<MarketData, 'id'>): Promise<MarketData>;
  }
  ```

### 1.2 Property Listing Integration

#### RapidAPI Integration
- [ ] Create property listing service
  ```typescript
  // backend/src/services/propertyListingService.ts
  interface PropertyListingService {
    searchProperties(params: {
      city?: string;
      zipCodes?: string[];
      minPrice?: number;
      maxPrice?: number;
      bedrooms?: number;
      propertyType?: string;
    }): Promise<Property[]>;
  }

  class RapidAPIPropertyService implements PropertyListingService {
    private readonly apiKey: string;
    private readonly baseUrl: string;

    constructor(apiKey: string, baseUrl: string) {
      this.apiKey = apiKey;
      this.baseUrl = baseUrl;
    }

    async searchProperties(params: SearchParams): Promise<Property[]> {
      // Implement API calls to RapidAPI
      // Transform response to our Property model
      // Cache results if needed
    }
  }
  ```

#### Data Import System
- [ ] Create data import scripts
  ```typescript
  // backend/src/scripts/import/marketData.ts
  async function importHudRentalRates() {
    // Download and parse HUD data
    // Transform to our MarketData model
    // Import to database
  }

  async function importFhfaPropertyValues() {
    // Download and parse FHFA data
    // Transform to our MarketData model
    // Import to database
  }
  ```

### 1.3 Core API Endpoints

#### Analysis API
- [ ] Create analysis controller
  ```typescript
  // backend/src/controllers/analysisController.ts
  class AnalysisController {
    async calculateAnalysis(req: Request, res: Response) {
      const {
        location, // city or zipCodes
        filters, // optional property filters
        analysisParams, // cash flow calculation parameters
      } = req.body;

      // 1. Get properties for location
      // 2. Get market data
      // 3. Calculate cash flow
      // 4. Return results
    }
  }
  ```

#### API Routes
- [ ] Set up Express routes
  ```typescript
  // backend/src/routes/analysis.ts
  const router = express.Router();

  router.post('/calculate', 
    validateAnalysisRequest,
    analysisController.calculateAnalysis
  );

  // backend/src/routes/index.ts
  const router = express.Router();

  router.use('/api/v1/analysis', analysisRoutes);
  ```

### 1.4 Analysis Engine

#### Cash Flow Calculator
- [ ] Implement calculation service
  ```typescript
  // backend/src/services/analysis/cashFlowCalculator.ts
  interface CashFlowCalculator {
    calculate(input: CashFlowInput): Promise<CashFlowResult>;
  }

  class StandardCashFlowCalculator implements CashFlowCalculator {
    async calculate(input: CashFlowInput): Promise<CashFlowResult> {
      // 1. Calculate mortgage payment
      // 2. Calculate operating expenses
      // 3. Calculate net cash flow
      // 4. Calculate returns
    }

    private calculateMortgagePayment(
      principal: number,
      interestRate: number,
      termYears: number
    ): number {
      // Implement mortgage calculation
    }

    private calculateOperatingExpenses(
      property: Property,
      expenses: OperatingExpenses
    ): number {
      // Calculate total operating expenses
    }
  }
  ```

#### Market Analysis
- [ ] Implement market analysis service
  ```typescript
  // backend/src/services/analysis/marketAnalyzer.ts
  interface MarketAnalyzer {
    analyzeLocation(locationId: number): Promise<MarketAnalysis>;
  }

  class StandardMarketAnalyzer implements MarketAnalyzer {
    async analyzeLocation(locationId: number): Promise<MarketAnalysis> {
      // 1. Get rental rates
      // 2. Get property values
      // 3. Calculate market metrics
      // 4. Return analysis
    }

    private calculateMarketMetrics(
      rentalRates: MarketData[],
      propertyValues: MarketData[]
    ): MarketMetrics {
      // Calculate cap rates, cash on cash, etc.
    }
  }
  ```

### 1.5 Testing

#### Unit Tests
- [ ] Create test suite for core services
  ```typescript
  // backend/src/services/analysis/__tests__/cashFlowCalculator.test.ts
  describe('CashFlowCalculator', () => {
    it('calculates correct mortgage payment', () => {
      // Test mortgage calculation
    });

    it('calculates correct operating expenses', () => {
      // Test expense calculation
    });

    it('calculates correct cash flow', () => {
      // Test full cash flow calculation
    });
  });
  ```

#### Integration Tests
- [ ] Create API integration tests
  ```typescript
  // backend/src/__tests__/api/analysis.test.ts
  describe('Analysis API', () => {
    it('calculates analysis for valid input', async () => {
      // Test full analysis endpoint
    });

    it('handles invalid input correctly', async () => {
      // Test error handling
    });
  });
  ```

## Definition of Done
- [ ] Database schema is implemented and tested
- [ ] Property listing integration is working
- [ ] Market data import system is functional
- [ ] Analysis API endpoints are implemented and tested
- [ ] Cash flow calculator is working correctly
- [ ] Market analysis service is implemented
- [ ] All core functionality is covered by tests
- [ ] API documentation is complete

## Notes
- Focus on MVP features first
- Use in-memory caching instead of Redis for now
- Implement basic error handling
- Add logging for debugging
- Consider rate limiting for external APIs
- Document all API endpoints
- Add input validation
- Implement proper error responses 