export interface Location {
  id: number;
  city: string;
  state: string;
  zipCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Property {
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
  id: row.id,
  locationId: row.location_id,
  address: row.address,
  price: row.price,
  bedrooms: row.bedrooms,
  bathrooms: row.bathrooms,
  squareFeet: row.square_feet,
  yearBuilt: row.year_built,
  propertyType: row.property_type,
  listingSource: row.listing_source,
  listingUrl: row.listing_url,
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