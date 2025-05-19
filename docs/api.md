# API Documentation

## Overview

The Rental Property Investment Analyzer API provides endpoints for analyzing rental properties, managing property data, and generating investment insights. The API follows RESTful principles and uses JSON for request/response bodies.

## Base URL

```
http://localhost:3001/api/v1
```

## Authentication

Authentication will be implemented in future versions using JWT tokens. For now, the API is open for development purposes.

## Common Headers

```
Content-Type: application/json
Accept: application/json
```

## Error Handling

The API uses standard HTTP status codes and returns error responses in a consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {} // Optional additional error details
  }
}
```

Common error codes:
- `INVALID_REQUEST`: The request was malformed
- `NOT_FOUND`: The requested resource was not found
- `VALIDATION_ERROR`: The request data failed validation
- `DATABASE_ERROR`: An error occurred while accessing the database
- `INTERNAL_ERROR`: An unexpected error occurred

## Endpoints

### Properties

#### Get Properties by Location

```http
GET /properties?location={location}&radius={radius}
```

Query Parameters:
- `location` (required): City name or ZIP code
- `radius` (optional): Search radius in miles (default: 5)

Response:
```json
{
  "properties": [
    {
      "id": "string",
      "address": "string",
      "city": "string",
      "state": "string",
      "zipCode": "string",
      "listPrice": "number",
      "estimatedRent": "number",
      "bedrooms": "number",
      "bathrooms": "number",
      "squareFeet": "number",
      "yearBuilt": "number",
      "propertyType": "string",
      "lastUpdated": "string"
    }
  ],
  "metadata": {
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

#### Get Property Details

```http
GET /properties/{id}
```

Response:
```json
{
  "id": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zipCode": "string",
  "listPrice": "number",
  "estimatedRent": "number",
  "bedrooms": "number",
  "bathrooms": "number",
  "squareFeet": "number",
  "yearBuilt": "number",
  "propertyType": "string",
  "description": "string",
  "features": ["string"],
  "images": ["string"],
  "lastUpdated": "string",
  "analysis": {
    "cashFlow": {
      "monthly": "number",
      "annual": "number"
    },
    "capRate": "number",
    "cashOnCashReturn": "number",
    "roi": "number"
  }
}
```

### Analysis

#### Calculate Property Analysis

```http
POST /analysis/calculate
```

Request Body:
```json
{
  "propertyId": "string",
  "parameters": {
    "purchasePrice": "number",
    "downPayment": "number",
    "interestRate": "number",
    "loanTerm": "number",
    "estimatedRent": "number",
    "vacancyRate": "number",
    "propertyTax": "number",
    "insurance": "number",
    "maintenance": "number",
    "propertyManagement": "number",
    "utilities": "number",
    "hoa": "number"
  }
}
```

Response:
```json
{
  "analysis": {
    "cashFlow": {
      "monthly": "number",
      "annual": "number"
    },
    "capRate": "number",
    "cashOnCashReturn": "number",
    "roi": "number",
    "mortgage": {
      "monthlyPayment": "number",
      "totalInterest": "number",
      "totalCost": "number"
    },
    "expenses": {
      "monthly": "number",
      "annual": "number",
      "breakdown": {
        "propertyTax": "number",
        "insurance": "number",
        "maintenance": "number",
        "propertyManagement": "number",
        "utilities": "number",
        "hoa": "number",
        "vacancy": "number"
      }
    }
  }
}
```

### Market Data

#### Get Market Trends

```http
GET /market/trends?location={location}
```

Query Parameters:
- `location` (required): City name or ZIP code

Response:
```json
{
  "location": "string",
  "trends": {
    "rentalPrices": {
      "current": "number",
      "historical": [
        {
          "date": "string",
          "value": "number"
        }
      ],
      "forecast": [
        {
          "date": "string",
          "value": "number"
        }
      ]
    },
    "propertyValues": {
      "current": "number",
      "historical": [
        {
          "date": "string",
          "value": "number"
        }
      ],
      "forecast": [
        {
          "date": "string",
          "value": "number"
        }
      ]
    }
  }
}
```

## Rate Limiting

Rate limiting will be implemented in future versions. For now, please be mindful of API usage during development.

## Versioning

The API version is included in the URL path (e.g., `/api/v1/`). Breaking changes will be released in new versions.

## Future Endpoints

The following endpoints are planned for future releases:

- User authentication and authorization
- Saved property lists
- Custom analysis reports
- Email notifications
- Market alerts
- Property comparison tools

## Support

For API support or to report issues, please create an issue in the GitHub repository. 