import axios, { AxiosInstance } from 'axios';
import { Property } from '../models/types';
import { LocationRepository } from '../repositories/locationRepository';
import { PropertyRepository } from '../repositories/propertyRepository';

export interface SearchParams {
  city?: string;
  zipCodes?: string[];
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  propertyType?: string;
}

export interface PropertyListingService {
  searchProperties(params: SearchParams): Promise<Property[]>;
}

export class RapidAPIPropertyService implements PropertyListingService {
  private readonly api: AxiosInstance;
  private readonly locationRepo: LocationRepository;
  private readonly propertyRepo: PropertyRepository;

  constructor(apiKey: string, baseUrl: string) {
    this.api = axios.create({
      baseURL: baseUrl,
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': new URL(baseUrl).host,
      },
    });
    this.locationRepo = new LocationRepository();
    this.propertyRepo = new PropertyRepository();
  }

  async searchProperties(params: SearchParams): Promise<Property[]> {
    try {
      // 1. Get or create location
      const location = await this.getOrCreateLocation(params);

      // 2. Search properties from RapidAPI
      const response = await this.api.get('/properties/search', {
        params: {
          city: params.city,
          zipCode: params.zipCodes?.join(','),
          minPrice: params.minPrice,
          maxPrice: params.maxPrice,
          beds: params.bedrooms,
          propertyType: params.propertyType,
        },
      });

      // 3. Transform and save properties
      const properties = await Promise.all(
        response.data.properties.map(async (apiProperty: any) => {
          const property = this.transformApiProperty(apiProperty, location.id);
          return this.propertyRepo.create(property);
        })
      );

      return properties;
    } catch (error) {
      console.error('Error searching properties:', error);
      throw new Error('Failed to search properties');
    }
  }

  private async getOrCreateLocation(params: SearchParams): Promise<{ id: number }> {
    if (!params.city) {
      throw new Error('City is required for property search');
    }

    // For now, we'll use a default state if not provided
    const state = 'CA'; // TODO: Make this configurable or get from params

    let location = await this.locationRepo.findByCityState(params.city, state);
    if (!location) {
      location = await this.locationRepo.create({
        city: params.city,
        state,
        zipCode: params.zipCodes?.[0], // Use first zip code if available
      });
    }

    return { id: location.id };
  }

  private transformApiProperty(apiProperty: any, locationId: number): Omit<Property, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      locationId,
      address: apiProperty.address || '',
      price: parseFloat(apiProperty.price) || 0,
      bedrooms: apiProperty.beds ? parseInt(apiProperty.beds) : undefined,
      bathrooms: apiProperty.baths ? parseFloat(apiProperty.baths) : undefined,
      squareFeet: apiProperty.squareFeet ? parseInt(apiProperty.squareFeet) : undefined,
      yearBuilt: apiProperty.yearBuilt ? parseInt(apiProperty.yearBuilt) : undefined,
      propertyType: apiProperty.propertyType,
      listingSource: 'rapidapi',
      listingUrl: apiProperty.listingUrl,
    };
  }
} 