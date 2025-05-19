import { BaseRepository } from './baseRepository';
import { AnalysisResult, AnalysisResultRow, AnalysisType, toAnalysisResult } from '../models/types';

export class AnalysisResultRepository extends BaseRepository<AnalysisResult, AnalysisResultRow> {
  constructor() {
    super('analysis_results');
  }

  protected toModel(row: AnalysisResultRow): AnalysisResult {
    return toAnalysisResult(row);
  }

  async findByProperty(propertyId: number): Promise<AnalysisResult[]> {
    const result = await this.query(
      'SELECT * FROM analysis_results WHERE property_id = $1 ORDER BY created_at DESC',
      [propertyId]
    );
    return result.rows.map(this.toModel);
  }

  async findByPropertyAndType(
    propertyId: number,
    analysisType: AnalysisType
  ): Promise<AnalysisResult[]> {
    const result = await this.query(
      'SELECT * FROM analysis_results WHERE property_id = $1 AND analysis_type = $2 ORDER BY created_at DESC',
      [propertyId, analysisType]
    );
    return result.rows.map(this.toModel);
  }

  async create(data: Omit<AnalysisResult, 'id' | 'createdAt'>): Promise<AnalysisResult> {
    const result = await this.query(
      `INSERT INTO analysis_results (
        property_id, analysis_type, input_data, results
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [
        data.propertyId,
        data.analysisType,
        data.inputData,
        data.results,
      ]
    );
    return this.toModel(result.rows[0]);
  }

  async deleteByProperty(propertyId: number): Promise<boolean> {
    const result = await this.query(
      'DELETE FROM analysis_results WHERE property_id = $1 RETURNING id',
      [propertyId]
    );
    return (result.rowCount ?? 0) > 0;
  }
} 