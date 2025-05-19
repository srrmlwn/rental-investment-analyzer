import { BaseRepository } from './baseRepository';
import { Location, LocationRow, toLocation } from '../models/types';

export class LocationRepository extends BaseRepository<Location, LocationRow> {
  constructor() {
    super('locations');
  }

  protected toModel(row: LocationRow): Location {
    return toLocation(row);
  }

  async findByCityState(city: string, state: string): Promise<Location | null> {
    const result = await this.query(
      'SELECT * FROM locations WHERE city = $1 AND state = $2',
      [city, state]
    );
    return result.rows[0] ? this.toModel(result.rows[0]) : null;
  }

  async findByZipCode(zipCode: string): Promise<Location | null> {
    const result = await this.query(
      'SELECT * FROM locations WHERE zip_code = $1',
      [zipCode]
    );
    return result.rows[0] ? this.toModel(result.rows[0]) : null;
  }

  async create(location: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>): Promise<Location> {
    const result = await this.query(
      `INSERT INTO locations (city, state, zip_code)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [location.city, location.state, location.zipCode]
    );
    return this.toModel(result.rows[0]);
  }

  async update(id: number, location: Partial<Omit<Location, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Location | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (location.city !== undefined) {
      updates.push(`city = $${paramCount}`);
      values.push(location.city);
      paramCount++;
    }
    if (location.state !== undefined) {
      updates.push(`state = $${paramCount}`);
      values.push(location.state);
      paramCount++;
    }
    if (location.zipCode !== undefined) {
      updates.push(`zip_code = $${paramCount}`);
      values.push(location.zipCode);
      paramCount++;
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await this.query(
      `UPDATE locations
       SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0] ? this.toModel(result.rows[0]) : null;
  }
} 