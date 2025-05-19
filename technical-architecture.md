# Rental Property Investment Analyzer - Technical Architecture

## 1. System Overview

### 1.1 Architecture Goals
- Support real-time property listing data with test market data (MVP)
- Enable scalable analysis of multiple locations
- Provide reliable and accurate financial calculations
- Support future API integrations and feature additions
- Ensure maintainable and extensible codebase

### 1.2 High-Level Architecture
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Web Frontend   │◄────┤  Backend API    │◄────┤  External APIs  │
│  (Next.js)      │     │  (Express)      │     │  (RapidAPI)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        ▲                       ▲                       ▲
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Static Assets  │     │  Test Data      │     │  Market Data    │
│                 │     │  (JSON)         │     │  (JSON)         │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 2. System Components

### 2.1 Frontend Application
#### Technology Stack
- React.js (TypeScript)
- Next.js for SSR and routing
- Tailwind CSS for styling
- React Query for data fetching
- Chart.js for data visualization

#### Key Features
- Location input interface
- Property listing display
- Financial analysis dashboard
- Report generation interface
- Responsive design for all devices

#### Component Structure
```
src/
├── components/
│   ├── location/
│   │   ├── CityInput.tsx
│   │   ├── ZipCodeInput.tsx
│   │   └── PropertyTypeFilter.tsx
│   ├── properties/
│   │   ├── PropertyList.tsx
│   │   ├── PropertyCard.tsx
│   │   └── PropertyDetails.tsx
│   ├── analysis/
│   │   ├── CashFlowAnalysis.tsx
│   │   ├── FinancialMetrics.tsx
│   │   └── MarketData.tsx
│   └── reports/
│       ├── ReportGenerator.tsx
│       └── PDFExport.tsx
├── pages/
│   ├── index.tsx
│   ├── analysis/[location].tsx
│   └── reports/[id].tsx
└── services/
    ├── api.ts
    ├── propertyService.ts
    └── analysisService.ts
```

### 2.2 Backend API
#### Technology Stack
- Node.js with Express
- TypeScript
- In-memory data storage (MVP)
- Jest for testing
- Express Validator for input validation

#### API Structure
```
/api
├── health
│   └── GET /api/health
└── analysis
    └── POST /api/analysis
        Request:
        {
          propertyId: string;
          analysisParams: {
            downPayment: number;
            interestRate: number;
            loanTerm: number;
            operatingExpenses: {
              propertyTax?: number;
              insurance?: number;
              hoa?: number;
              maintenance?: number;
              utilities?: number;
              propertyManagement?: number;
            }
          }
        }
        Response:
        {
          property: Property;
          marketAnalysis: MarketAnalysis;
          cashFlow: CashFlowResult;
        }
```

#### Core Services
1. Property Listing Service
   - Integration with RapidAPI
   - Property search and filtering
   - Property details retrieval
   - Data transformation and normalization

2. Market Analysis Service
   - Test data integration (MVP)
   - Market metrics calculation
   - Trend analysis
   - Location-based analysis

3. Cash Flow Calculator
   - Monthly and annual calculations
   - Cash-on-cash return
   - Expense management
   - Investment metrics

### 2.3 Data Management

#### Test Data Structure
```
data/
└── test/
    └── marketData.json
        {
          "san-francisco-ca": {
            "rentalRates": [...],
            "propertyValues": [...]
          },
          "oakland-ca": {
            "rentalRates": [...],
            "propertyValues": [...]
          }
        }
```

#### Data Types
```typescript
interface Property {
  id: string;
  locationId: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: 'single_family' | 'multi_family' | 'condo' | 'townhouse';
  listingSource: string;
  listingUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MarketAnalysis {
  locationId: string;
  metrics: {
    averageRentalRate: number;
    averagePropertyValue: number;
    capRate: number;
    cashOnCashReturn: number;
    rentalYield: number;
    priceToRentRatio: number;
    rentalRateTrend: number;
    propertyValueTrend: number;
  };
  lastUpdated: Date;
}

interface CashFlowResult {
  monthlyPayment: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  cashOnCashReturn: number;
}
```

### 2.4 Error Handling
#### Error Types
```typescript
enum ErrorCodes {
  PROPERTY_NOT_FOUND = 'PROPERTY_NOT_FOUND',
  INVALID_INPUT = 'INVALID_INPUT',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: ErrorCodes,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

#### Error Response Format
```json
{
  "error": {
    "code": "PROPERTY_NOT_FOUND",
    "message": "Property with ID 123 not found"
  }
}
```

## 3. Testing Strategy

### 3.1 Unit Tests
- Market Analyzer tests
  - Location analysis
  - Metric calculations
  - Error handling
- Cash Flow Calculator tests
  - Monthly and annual calculations
  - Edge cases
  - Input validation

### 3.2 Integration Tests
- API endpoint tests
  - Analysis endpoint
  - Input validation
  - Error responses
- Property listing service tests
  - Property search
  - Property details
  - Error handling

## 4. Security

### 4.1 API Security
- Input validation using express-validator
- Error handling middleware
- CORS configuration
- Helmet for security headers

### 4.2 Data Security
- HTTPS everywhere
- Secure API key storage
- Input sanitization
- Rate limiting (future)

## 5. Deployment & Infrastructure

### 5.1 Infrastructure (MVP)
- Node.js runtime
- Express server
- Environment-based configuration
- Health check endpoint

### 5.2 Monitoring & Logging
- Error logging
- Request logging
- Performance monitoring (future)
- Usage analytics (future)

## 6. Evolution Path

### 6.1 MVP to P1 Transition
1. Database Integration
   - Add PostgreSQL database
   - Implement data models
   - Add data persistence
   - Migrate from test data

2. Enhanced Features
   - User authentication
   - Saved analyses
   - Historical data tracking
   - Advanced market metrics

3. Performance Optimization
   - Add Redis caching
   - Implement rate limiting
   - Add request queuing
   - Optimize data queries

### 6.2 P1 to P2 Transition
1. Advanced Features
   - Portfolio management
   - Market analysis
   - Advanced metrics

2. Scale Improvements
   - Database optimization
   - Caching enhancements
   - API performance

### 6.3 Future Considerations
- Mobile application
- Additional API integrations
- Machine learning for predictions
- Real-time notifications
- Advanced analytics

## 7. Development Workflow

### 7.1 Development Environment
- Docker for local development
- Environment configuration
- Database migrations
- API mocking

### 7.2 Testing Strategy
- Unit tests
- Integration tests
- E2E tests
- Performance tests
- Data validation tests

### 7.3 Deployment Process
1. Development
2. Staging
3. Production
4. Monitoring
5. Rollback procedures 