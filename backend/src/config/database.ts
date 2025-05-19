import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';
const databaseUrl = isTest ? process.env.DATABASE_TEST_URL : process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const pool = new Pool({
  connectionString: databaseUrl,
});

// For migrations
export const getDbConfig = () => ({
  connectionString: databaseUrl,
});

// Test the connection
pool.connect()
  .then(() => console.log('Successfully connected to database'))
  .catch((err) => {
    console.error('Error connecting to database:', err);
    process.exit(1);
  });

// Helper function to test the connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    client.release();
    return true;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return false;
  }
};

// Helper function to execute queries with proper error handling
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error executing query:', { text, error });
    throw error;
  }
};

export default pool; 