# Rental Property Investment Analyzer - Technical Architecture

## 1. System Overview

### 1.1 Architecture Goals
- Support real-time property listing data with static market data
- Enable scalable analysis of multiple locations
- Provide reliable and accurate financial calculations
- Support future API integrations and feature additions
- Ensure maintainable and extensible codebase

### 1.2 High-Level Architecture
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Web Frontend   │◄────┤  Backend API    │◄────┤  Data Services  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        ▲                       ▲                       ▲
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Static Assets  │     │  Cache Layer    │     │  External APIs  │
│                 │     │                 │     │                 │
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
- PostgreSQL for primary database
- Redis for caching
- Bull for job queues

#### API Structure
```
/api
├── v1/
│   ├── locations/
│   │   ├── GET /search
│   │   └── GET /:id/properties
│   ├── properties/
│   │   ├── GET /search
│   │   └── GET /:id/analysis
│   ├── market-data/
│   │   ├── GET /rental-rates
│   │   └── GET /market-averages
│   └── reports/
│       ├── POST /generate
│       └── GET /:id
```

### 2.3 Data Services
#### Database Schema
```sql
-- Core Tables
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    city VARCHAR(100),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES locations(id),
    listing_price DECIMAL,
    property_type VARCHAR(50),
    details JSONB,
    source_id VARCHAR(100),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE market_data (
    id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES locations(id),
    data_type VARCHAR(50),
    data JSONB,
    valid_from TIMESTAMP,
    valid_to TIMESTAMP,
    created_at TIMESTAMP
);

CREATE TABLE analysis_results (
    id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES locations(id),
    analysis_type VARCHAR(50),
    results JSONB,
    created_at TIMESTAMP
);
```

#### Data Flow
1. Property Listings
   - Real-time API integration
   - Periodic sync with external sources
   - Cache in Redis for quick access
   - Store in PostgreSQL for persistence

2. Market Data
   - Static file imports (monthly)
   - Cache in Redis
   - Store in PostgreSQL
   - Future: Real-time API integration

3. Analysis Results
   - Generated on-demand
   - Cached in Redis
   - Stored in PostgreSQL
   - PDF generation via queue

### 2.4 External Services Integration
#### Property Listing APIs (P0)
- Integration with MLS APIs
- Rate limiting and caching
- Error handling and fallbacks
- Data normalization

#### Market Data APIs (P1)
- Rental market APIs
- Real estate market APIs
- Economic indicators APIs
- Data aggregation and normalization

## 3. Data Management

### 3.1 Static Data Management
#### File Structure
```
data/
├── rental-rates/
│   ├── by-zipcode.json
│   └── by-property-type.json
├── market-averages/
│   ├── by-city.json
│   └── by-zipcode.json
└── operating-expenses/
    ├── tax-rates.json
    └── expense-ratios.json
```

#### Update Process
1. Monthly data updates
2. Validation scripts
3. Database import
4. Cache invalidation
5. Version control

### 3.2 Caching Strategy
- Redis for:
  - Property listings (5-minute TTL)
  - Market data (24-hour TTL)
  - Analysis results (1-hour TTL)
- Cache invalidation on:
  - Data updates
  - Analysis generation
  - User actions

## 4. Security

### 4.1 Authentication & Authorization
- JWT-based authentication
- Role-based access control
- API key management
- Rate limiting

### 4.2 Data Security
- HTTPS everywhere
- Data encryption at rest
- Secure API key storage
- Input validation
- SQL injection prevention

## 5. Deployment & Infrastructure

### 5.1 Infrastructure (MVP)
- AWS or similar cloud provider
- Docker containers
- Kubernetes for orchestration
- CI/CD pipeline

### 5.2 Monitoring & Logging
- Application metrics
- Error tracking
- Performance monitoring
- Usage analytics

## 6. Evolution Path

### 6.1 P0 to P1 Transition
1. API Integration
   - Add new API endpoints
   - Implement real-time data fetching
   - Update caching strategy

2. Enhanced Analysis
   - Add new financial metrics
   - Implement comparison features
   - Enhance reporting

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