import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';

// Validation middleware
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errors.array()
    });
  }
  next();
};

// Analysis request validation
export const validateAnalysisRequest = [
  param('propertyId').isInt({ min: 1 }).withMessage('Property ID must be a positive integer'),
  body('analysisParams').isObject().withMessage('Analysis parameters must be an object'),
  body('analysisParams.downPayment')
    .isFloat({ min: 0 })
    .withMessage('Down payment must be a non-negative number'),
  body('analysisParams.interestRate')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Interest rate must be between 0 and 100'),
  body('analysisParams.loanTerm')
    .isInt({ min: 1, max: 50 })
    .withMessage('Loan term must be between 1 and 50 years'),
  body('analysisParams.operatingExpenses').isObject().withMessage('Operating expenses must be an object'),
  body('analysisParams.operatingExpenses.propertyTax')
    .isFloat({ min: 0 })
    .withMessage('Property tax must be a non-negative number'),
  body('analysisParams.operatingExpenses.insurance')
    .isFloat({ min: 0 })
    .withMessage('Insurance cost must be a non-negative number'),
  body('analysisParams.operatingExpenses.maintenance')
    .isFloat({ min: 0 })
    .withMessage('Maintenance cost must be a non-negative number'),
  body('analysisParams.operatingExpenses.management')
    .isFloat({ min: 0 })
    .withMessage('Management cost must be a non-negative number'),
  body('analysisParams.operatingExpenses.hoa')
    .isFloat({ min: 0 })
    .withMessage('HOA fees must be a non-negative number'),
  body('analysisParams.operatingExpenses.utilities')
    .isFloat({ min: 0 })
    .withMessage('Utilities cost must be a non-negative number'),
  body('analysisParams.operatingExpenses.vacancy')
    .isFloat({ min: 0 })
    .withMessage('Vacancy cost must be a non-negative number'),
  validate
];

// Property creation validation
export const validatePropertyCreation = [
  body('locationId').isInt({ min: 1 }).withMessage('Location ID must be a positive integer'),
  body('address').isString().notEmpty().withMessage('Address is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('bedrooms').isInt({ min: 0 }).withMessage('Bedrooms must be a non-negative integer'),
  body('bathrooms').isFloat({ min: 0 }).withMessage('Bathrooms must be a non-negative number'),
  body('squareFeet').isInt({ min: 0 }).withMessage('Square feet must be a non-negative integer'),
  body('propertyType')
    .isIn(['single_family', 'multi_family', 'condo', 'townhouse'])
    .withMessage('Invalid property type'),
  body('listingSource').isString().notEmpty().withMessage('Listing source is required'),
  body('listingUrl').isURL().withMessage('Listing URL must be a valid URL'),
  validate
];

// Location creation validation
export const validateLocationCreation = [
  body('city').isString().notEmpty().withMessage('City is required'),
  body('state').isString().isLength({ min: 2, max: 2 }).withMessage('State must be a 2-letter code'),
  body('zipCode').isString().matches(/^\d{5}(-\d{4})?$/).withMessage('Invalid ZIP code format'),
  validate
];

// Market data validation
export const validateMarketData = [
  body('locationId').isInt({ min: 1 }).withMessage('Location ID must be a positive integer'),
  body('dataType')
    .isIn(['rental_rate', 'property_value'])
    .withMessage('Data type must be either rental_rate or property_value'),
  body('value').isFloat({ min: 0 }).withMessage('Value must be a non-negative number'),
  body('year').isInt({ min: 2000, max: 2100 }).withMessage('Year must be between 2000 and 2100'),
  body('month').isInt({ min: 1, max: 12 }).withMessage('Month must be between 1 and 12'),
  body('source').isString().notEmpty().withMessage('Source is required'),
  validate
]; 