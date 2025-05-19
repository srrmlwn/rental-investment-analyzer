import axios from 'axios';
import { Property } from '../models/types';
import { LocationRepository } from '../repositories/locationRepository';
import { PropertyRepository } from '../repositories/propertyRepository';

export interface SearchParams {
  city?: string;
  state?: string;
  zipCode?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  bedsMin?: number;
  bathsMin?: number;
}

export class PropertyListingService {
  private apiKey: string;
  private baseUrl: string;
  private readonly locationRepo: LocationRepository;
  private readonly propertyRepo: PropertyRepository;

  constructor() {
    this.apiKey = process.env.RAPIDAPI_KEY || '';
    this.baseUrl = 'https://realty-in-us.p.rapidapi.com/properties/v3';
    this.locationRepo = new LocationRepository();
    this.propertyRepo = new PropertyRepository();
  }

  async searchProperties(params: SearchParams): Promise<Property[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/list`, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'realty-in-us.p.rapidapi.com'
        },
        params: {
          city: params.city,
          state_code: params.state,
          postal_code: params.zipCode,
          price_min: params.minPrice,
          price_max: params.maxPrice,
          property_type: params.propertyType,
          beds_min: params.bedsMin,
          baths_min: params.bathsMin
        }
      });

      if (!response.data?.data?.home_search?.results) {
        return [];
      }

      const properties = await Promise.all(
        response.data.data.home_search.results.map(async (apiProperty: any) => {
          const property = this.transformPropertyData(apiProperty);
          return this.propertyRepo.create(property);
        })
      );

      return properties;
    } catch (error) {
      console.error('Error searching properties:', error);
      return [];
    }
  }

  async getPropertyById(propertyId: string): Promise<Property | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/list`, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'realty-in-us.p.rapidapi.com'
        },
        params: {
          property_id: propertyId
        }
      });

      if (!response.data?.data?.home_search?.results?.length) {
        return null;
      }

      const propertyData = response.data.data.home_search.results[0];
      return this.transformPropertyData(propertyData);
    } catch (error) {
      console.error('Error fetching property:', error);
      return null;
    }
  }

  private transformPropertyData(data: any): Property {
    const location = data.location;
    const propertyId = data.property_id || data.mls_id || data.listing_id;
    const locationId = `${location.city.toLowerCase()}-${location.state_code.toLowerCase()}`;

    return {
      id: propertyId.toString(),
      locationId,
      address: `${location.address.line}, ${location.address.city}, ${location.address.state_code} ${location.address.postal_code}`,
      price: data.list_price,
      bedrooms: data.description.beds || 0,
      bathrooms: data.description.baths || 0,
      squareFeet: data.description.sqft || 0,
      propertyType: this.mapPropertyType(data.property_type),
      listingSource: 'rapidapi',
      listingUrl: data.permalink || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private mapPropertyType(apiType: string): 'single_family' | 'multi_family' | 'condo' | 'townhouse' {
    const typeMap: { [key: string]: 'single_family' | 'multi_family' | 'condo' | 'townhouse' } = {
      'single_family': 'single_family',
      'multi_family': 'multi_family',
      'condo': 'condo',
      'townhouse': 'townhouse'
    };
    return typeMap[apiType.toLowerCase()] || 'single_family';
  }
} 