import { Request, Response, NextFunction } from 'express';
import { PropertyListingService } from '../services/propertyListingService';
import { StandardMarketAnalyzer } from '../services/analysis/marketAnalyzer';
import { StandardCashFlowCalculator } from '../services/analysis/cashFlowCalculator';
import { ApiError, ErrorCodes } from '../types/errors';
import { CashFlowInput } from '../models/types';

export class AnalysisController {
  private propertyService: PropertyListingService;
  private marketAnalyzer: StandardMarketAnalyzer;
  private cashFlowCalculator: StandardCashFlowCalculator;

  constructor() {
    this.propertyService = new PropertyListingService();
    this.marketAnalyzer = new StandardMarketAnalyzer();
    this.cashFlowCalculator = new StandardCashFlowCalculator();
  }

  calculateAnalysis = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { propertyId, analysisParams } = req.body;

      // Get property details from listings API
      const property = await this.propertyService.getPropertyById(propertyId.toString());
      if (!property) {
        throw new ApiError(404, ErrorCodes.PROPERTY_NOT_FOUND, `Property ${propertyId} not found`);
      }

      // Get market analysis for the property's location
      const marketAnalysis = await this.marketAnalyzer.analyzeLocation(property.locationId);

      // Calculate cash flow
      const cashFlow = await this.cashFlowCalculator.calculate({
        price: property.price,
        downPayment: analysisParams.downPayment,
        interestRate: analysisParams.interestRate,
        loanTerm: analysisParams.loanTerm,
        rent: marketAnalysis.metrics.averageRentalRate,
        expenses: this.calculateMonthlyExpenses(analysisParams.operatingExpenses)
      });

      res.json({
        property,
        marketAnalysis,
        cashFlow
      });
    } catch (error) {
      next(error);
    }
  };

  private calculateMonthlyExpenses(expenses: {
    propertyTax?: number;
    insurance?: number;
    hoa?: number;
    maintenance?: number;
    utilities?: number;
    propertyManagement?: number;
  }): number {
    const {
      propertyTax = 0,
      insurance = 0,
      hoa = 0,
      maintenance = 0,
      utilities = 0,
      propertyManagement = 0
    } = expenses;

    return propertyTax + insurance + hoa + maintenance + utilities + propertyManagement;
  }
} 