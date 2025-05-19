# Rental Property Investment Analyzer

A comprehensive web application for analyzing potential rental property investments. The application helps investors make informed decisions by providing detailed analysis of properties based on various financial metrics.

## Features

- Location-based property analysis
- Cash flow prediction
- Property comparison tools
- Market trend analysis
- Automated reporting (future)
- Email notifications (future)

## Tech Stack

### Frontend
- Next.js 15.3.2
- React 19
- TypeScript
- Tailwind CSS
- React Query
- Jest & React Testing Library

### Backend
- Node.js
- Express
- PostgreSQL
- TypeScript
- Jest

## Prerequisites

- Node.js (v18 or later)
- PostgreSQL (v14 or later)
- Git
- npm or yarn

## Getting Started

### Clone the Repository
```bash
git clone https://github.com/srrmlwn/rental-investment-analyzer.git
cd rental-investment-analyzer
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rental_analyzer
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration (for future use)
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
```

4. Create the database:
```bash
createdb rental_analyzer
createdb rental_analyzer_test
```

5. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Development Workflow

### Running Tests

Backend:
```bash
cd backend
npm test
```

Frontend:
```bash
cd frontend
npm test
```

### Code Quality

Both frontend and backend use ESLint and Prettier for code quality:

```bash
# Backend
cd backend
npm run lint
npm run format

# Frontend
cd frontend
npm run lint
```

### Git Workflow

1. Create a new branch for each feature/fix
2. Write tests for new features
3. Ensure all tests pass
4. Submit a pull request
5. Code review required before merging

## Project Structure

```
rental-investment-analyzer/
├── backend/           # Node.js/Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   └── package.json
├── frontend/          # Next.js app
│   ├── src/
│   │   ├── components/
│   │   ├── app/
│   │   ├── styles/
│   │   └── utils/
│   ├── public/
│   └── package.json
├── data/             # Static data files
├── scripts/          # Utility scripts
└── README.md
```

## API Documentation

API documentation is available at `/api/docs` when running the backend server. The API follows RESTful principles and uses JSON for request/response bodies.

### Authentication

Authentication will be implemented in future versions using JWT tokens.

### Error Handling

The API uses standard HTTP status codes and returns error responses in the following format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Notes

- The application is currently in development
- Some features are planned for future releases
- Database migrations will be added in future updates
- Docker support will be added in a future phase
