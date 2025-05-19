import { Pool, QueryResult } from 'pg';
import { pool } from '../config/database';

export abstract class BaseRepository<T, R> {
  protected pool: Pool;
  protected tableName: string;

  constructor(tableName: string) {
    this.pool = pool;
    this.tableName = tableName;
  }

  protected async query(text: string, params?: any[]): Promise<QueryResult> {
    return this.pool.query(text, params);
  }

  async findById(id: number): Promise<T | null> {
    const result = await this.query(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return result.rows[0] ? this.toModel(result.rows[0]) : null;
  }

  async findAll(): Promise<T[]> {
    const result = await this.query(`SELECT * FROM ${this.tableName}`);
    return result.rows.map(this.toModel);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.query(
      `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING id`,
      [id]
    );
    return (result.rowCount ?? 0) > 0;
  }

  protected abstract toModel(row: R): T;
} 