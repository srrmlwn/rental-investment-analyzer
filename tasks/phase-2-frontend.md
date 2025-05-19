# Phase 2: Frontend MVP

## Overview
This phase focuses on implementing the frontend user interface for the rental property investment analyzer. The goal is to create an intuitive and responsive web application that allows users to analyze potential rental property investments.

## Dependencies
- Next.js frontend (from Phase 0)
- Backend API (from Phase 1)
- Tailwind CSS
- React Query for data fetching
- Recharts for data visualization

## Tasks

### 2.1 Project Structure

#### Component Organization
- [ ] Set up component structure
  ```
  frontend/src/
  ├── components/
  │   ├── common/           # Reusable UI components
  │   │   ├── Button/
  │   │   ├── Input/
  │   │   ├── Select/
  │   │   └── Card/
  │   ├── layout/           # Layout components
  │   │   ├── Header/
  │   │   ├── Footer/
  │   │   └── Sidebar/
  │   ├── analysis/         # Analysis-specific components
  │   │   ├── PropertyCard/
  │   │   ├── AnalysisForm/
  │   │   └── ResultsTable/
  │   └── charts/           # Data visualization components
  │       ├── CashFlowChart/
  │       └── MarketTrendsChart/
  ├── hooks/               # Custom React hooks
  ├── services/           # API service functions
  ├── utils/              # Utility functions
  └── types/              # TypeScript type definitions
  ```

#### Type Definitions
- [ ] Create shared types
  ```typescript
  // frontend/src/types/analysis.ts
  interface AnalysisInput {
    location: {
      city?: string;
      zipCodes?: string[];
    };
    filters?: {
      minPrice?: number;
      maxPrice?: number;
      bedrooms?: number;
      propertyType?: string;
    };
    analysisParams: {
      downPayment: number;
      interestRate: number;
      loanTerm: number;
      operatingExpenses: {
        propertyTax: number;
        insurance: number;
        maintenance: number;
        management: number;
        hoa: number;
        utilities: number;
        vacancy: number;
      };
    };
  }

  interface AnalysisResult {
    properties: Property[];
    marketData: MarketData;
    cashFlow: CashFlowResult;
    metrics: InvestmentMetrics;
  }
  ```

### 2.2 Core Components

#### Common Components
- [ ] Implement Button component
  ```typescript
  // frontend/src/components/common/Button/Button.tsx
  interface ButtonProps {
    variant: 'primary' | 'secondary' | 'outline';
    size: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
  }

  const Button: React.FC<ButtonProps> = ({
    variant,
    size,
    children,
    onClick,
    disabled,
    loading,
  }) => {
    // Implement button component with Tailwind styles
  };
  ```

- [ ] Implement Input component
  ```typescript
  // frontend/src/components/common/Input/Input.tsx
  interface InputProps {
    type: 'text' | 'number' | 'email';
    label: string;
    value: string | number;
    onChange: (value: string) => void;
    error?: string;
    required?: boolean;
  }

  const Input: React.FC<InputProps> = ({
    type,
    label,
    value,
    onChange,
    error,
    required,
  }) => {
    // Implement input component with validation
  };
  ```

#### Analysis Components
- [ ] Implement AnalysisForm component
  ```typescript
  // frontend/src/components/analysis/AnalysisForm/AnalysisForm.tsx
  interface AnalysisFormProps {
    onSubmit: (data: AnalysisInput) => void;
    loading?: boolean;
  }

  const AnalysisForm: React.FC<AnalysisFormProps> = ({
    onSubmit,
    loading,
  }) => {
    // Implement form with all analysis inputs
    // Use react-hook-form for form handling
    // Include validation
  };
  ```

- [ ] Implement PropertyCard component
  ```typescript
  // frontend/src/components/analysis/PropertyCard/PropertyCard.tsx
  interface PropertyCardProps {
    property: Property;
    analysis: CashFlowResult;
    onClick?: () => void;
  }

  const PropertyCard: React.FC<PropertyCardProps> = ({
    property,
    analysis,
    onClick,
  }) => {
    // Implement property card with key metrics
  };
  ```

### 2.3 API Integration

#### API Services
- [ ] Create API client
  ```typescript
  // frontend/src/services/api.ts
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  export const analysisApi = {
    calculateAnalysis: async (input: AnalysisInput): Promise<AnalysisResult> => {
      const response = await api.post('/api/v1/analysis/calculate', input);
      return response.data;
    },
  };
  ```

#### React Query Hooks
- [ ] Create custom hooks
  ```typescript
  // frontend/src/hooks/useAnalysis.ts
  export const useAnalysis = (input: AnalysisInput) => {
    return useQuery(
      ['analysis', input],
      () => analysisApi.calculateAnalysis(input),
      {
        enabled: Boolean(input.location.city || input.location.zipCodes?.length),
      }
    );
  };
  ```

### 2.4 Pages

#### Main Analysis Page
- [ ] Implement analysis page
  ```typescript
  // frontend/src/pages/analysis.tsx
  const AnalysisPage: NextPage = () => {
    const [analysisInput, setAnalysisInput] = useState<AnalysisInput | null>(null);
    const { data, isLoading, error } = useAnalysis(analysisInput);

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Property Investment Analysis</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <AnalysisForm
              onSubmit={setAnalysisInput}
              loading={isLoading}
            />
          </div>
          
          {data && (
            <div>
              <ResultsSummary data={data} />
              <PropertyList properties={data.properties} />
            </div>
          )}
        </div>
      </div>
    );
  };
  ```

#### Results Page
- [ ] Implement results page
  ```typescript
  // frontend/src/pages/analysis/[id].tsx
  const AnalysisResultsPage: NextPage = () => {
    const { id } = useRouter().query;
    const { data, isLoading } = useAnalysisResults(id as string);

    return (
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <LoadingSpinner />
        ) : data ? (
          <>
            <AnalysisHeader data={data} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CashFlowChart data={data.cashFlow} />
              <MarketTrendsChart data={data.marketData} />
            </div>
            <PropertyDetails properties={data.properties} />
          </>
        ) : (
          <ErrorMessage message="Analysis not found" />
        )}
      </div>
    );
  };
  ```

### 2.5 Data Visualization

#### Charts
- [ ] Implement CashFlowChart
  ```typescript
  // frontend/src/components/charts/CashFlowChart/CashFlowChart.tsx
  interface CashFlowChartProps {
    data: CashFlowResult;
  }

  const CashFlowChart: React.FC<CashFlowChartProps> = ({ data }) => {
    // Implement chart using Recharts
    // Show monthly cash flow over time
    // Include income and expenses
  };
  ```

- [ ] Implement MarketTrendsChart
  ```typescript
  // frontend/src/components/charts/MarketTrendsChart/MarketTrendsChart.tsx
  interface MarketTrendsChartProps {
    data: MarketData;
  }

  const MarketTrendsChart: React.FC<MarketTrendsChartProps> = ({ data }) => {
    // Implement chart using Recharts
    // Show property values and rental rates over time
  };
  ```

### 2.6 Styling and UI

#### Theme Configuration
- [ ] Configure Tailwind theme
  ```javascript
  // frontend/tailwind.config.js
  module.exports = {
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#f0f9ff',
            // ... add more shades
            900: '#0c4a6e',
          },
          secondary: {
            // ... add secondary colors
          },
        },
        spacing: {
          // ... add custom spacing
        },
      },
    },
  };
  ```

#### Responsive Design
- [ ] Implement responsive layouts
  - [ ] Mobile-first design
  - [ ] Breakpoint-specific layouts
  - [ ] Responsive tables and charts
  - [ ] Touch-friendly interactions

### 2.7 Testing

#### Component Tests
- [ ] Create component tests
  ```typescript
  // frontend/src/components/analysis/__tests__/AnalysisForm.test.tsx
  describe('AnalysisForm', () => {
    it('renders all form fields', () => {
      // Test form rendering
    });

    it('validates required fields', () => {
      // Test form validation
    });

    it('submits form data correctly', () => {
      // Test form submission
    });
  });
  ```

#### Integration Tests
- [ ] Create page tests
  ```typescript
  // frontend/src/pages/__tests__/analysis.test.tsx
  describe('AnalysisPage', () => {
    it('loads and displays analysis form', () => {
      // Test page rendering
    });

    it('shows results after form submission', () => {
      // Test analysis flow
    });
  });
  ```

## Definition of Done
- [ ] All core components are implemented
- [ ] API integration is working
- [ ] Data visualization is implemented
- [ ] Responsive design is complete
- [ ] Form validation is working
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] Tests are passing
- [ ] UI is polished and consistent

## Notes
- Focus on MVP features first
- Ensure mobile responsiveness
- Implement proper loading states
- Add error boundaries
- Use proper TypeScript types
- Follow accessibility guidelines
- Implement proper form validation
- Add proper error messages
- Consider performance optimization
- Add proper documentation 