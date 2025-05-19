import { BaseRepository } from './baseRepository';
import { Property, PropertyRow, toProperty } from '../models/types';

export class PropertyRepository extends BaseRepository<Property, PropertyRow> {
  constructor() {
    super('properties');
  }

  protected toModel(row: PropertyRow): Property {
    return toProperty(row);
  }

  async findByLocation(locationId: number): Promise<Property[]> {
    const result = await this.query(
      'SELECT * FROM properties WHERE location_id = $1',
      [locationId]
    );
    return result.rows.map(this.toModel);
  }

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<Property[]> {
    const result = await this.query(
      'SELECT * FROM properties WHERE price BETWEEN $1 AND $2',
      [minPrice, maxPrice]
    );
    return result.rows.map(this.toModel);
  }

  async create(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> {
    const result = await this.query(
      `INSERT INTO properties (
        location_id, address, price, bedrooms, bathrooms,
        square_feet, year_built, property_type, listing_source, listing_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        property.locationId,
        property.address,
        property.price,
        property.bedrooms,
        property.bathrooms,
        property.squareFeet,
        property.yearBuilt,
        property.propertyType,
        property.listingSource,
        property.listingUrl,
      ]
    );
    return this.toModel(result.rows[0]);
  }

  async update(id: number, property: Partial<Omit<Property, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Property | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    const fields = {
      locationId: 'location_id',
      address: 'address',
      price: 'price',
      bedrooms: 'bedrooms',
      bathrooms: 'bathrooms',
      squareFeet: 'square_feet',
      yearBuilt: 'year_built',
      propertyType: 'property_type',
      listingSource: 'listing_source',
      listingUrl: 'listing_url',
    };

    for (const [key, dbKey] of Object.entries(fields)) {
      const value = (property as any)[key];
      if (value !== undefined) {
        updates.push(`${dbKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await this.query(
      `UPDATE properties
       SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0] ? this.toModel(result.rows[0]) : null;
  }
} 