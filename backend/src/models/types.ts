export interface Location {
  id: number;
  city: string;
  state: string;
  zipCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Property {
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

export type MarketDataType = 'rental_rate' | 'property_value';

export interface MarketData {
  id: number;
  locationId: number;
  dataType: MarketDataType;
  value: number;
  year: number;
  month?: number;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AnalysisType = 'cash_flow' | 'roi' | 'cap_rate';

export interface AnalysisResult {
  id: number;
  propertyId: number;
  analysisType: AnalysisType;
  inputData: Record<string, any>;
  results: Record<string, any>;
  createdAt: Date;
}

export interface CashFlowInput {
  price: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  rent: number;
  expenses: number;
}

// Database row types (snake_case)
export interface LocationRow {
  id: number;
  city: string;
  state: string;
  zip_code?: string;
  created_at: Date;
  updated_at: Date;
}

export interface PropertyRow {
  id: number;
  location_id: number;
  address: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  year_built?: number;
  property_type?: string;
  listing_source: string;
  listing_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface MarketDataRow {
  id: number;
  location_id: number;
  data_type: MarketDataType;
  value: number;
  year: number;
  month?: number;
  source: string;
  created_at: Date;
  updated_at: Date;
}

export interface AnalysisResultRow {
  id: number;
  property_id: number;
  analysis_type: AnalysisType;
  input_data: Record<string, any>;
  results: Record<string, any>;
  created_at: Date;
}

// Helper functions to convert between camelCase and snake_case
export const toLocation = (row: LocationRow): Location => ({
  id: row.id,
  city: row.city,
  state: row.state,
  zipCode: row.zip_code,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const toProperty = (row: PropertyRow): Property => ({
  id: row.id.toString(),
  locationId: row.location_id.toString(),
  address: row.address,
  price: row.price,
  bedrooms: row.bedrooms || 0,
  bathrooms: row.bathrooms || 0,
  squareFeet: row.square_feet || 0,
  propertyType: row.property_type as 'single_family' | 'multi_family' | 'condo' | 'townhouse' || 'single_family',
  listingSource: row.listing_source,
  listingUrl: row.listing_url || '',
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const toMarketData = (row: MarketDataRow): MarketData => ({
  id: row.id,
  locationId: row.location_id,
  dataType: row.data_type,
  value: row.value,
  year: row.year,
  month: row.month,
  source: row.source,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const toAnalysisResult = (row: AnalysisResultRow): AnalysisResult => ({
  id: row.id,
  propertyId: row.property_id,
  analysisType: row.analysis_type,
  inputData: row.input_data,
  results: row.results,
  createdAt: row.created_at,
}); 