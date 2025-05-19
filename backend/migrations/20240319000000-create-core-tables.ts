import { MigrationBuilder } from 'node-pg-migrate';

export const up = (pgm: MigrationBuilder) => {
  // Create locations table
  pgm.createTable('locations', {
    id: 'id',
    city: { type: 'varchar(100)', notNull: true },
    state: { type: 'varchar(2)', notNull: true },
    zip_code: { type: 'varchar(10)' },
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addConstraint('locations', 'locations_city_state_zip_unique', {
    unique: ['city', 'state', 'zip_code'],
  });

  // Create properties table
  pgm.createTable('properties', {
    id: 'id',
    location_id: {
      type: 'integer',
      notNull: true,
      references: '"locations"',
      onDelete: 'CASCADE',
    },
    address: { type: 'text', notNull: true },
    price: { type: 'decimal(12,2)', notNull: true },
    bedrooms: { type: 'integer' },
    bathrooms: { type: 'decimal(4,2)' },
    square_feet: { type: 'integer' },
    year_built: { type: 'integer' },
    property_type: { type: 'varchar(50)' },
    listing_source: { type: 'varchar(50)', notNull: true },
    listing_url: { type: 'text' },
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Create market_data table
  pgm.createTable('market_data', {
    id: 'id',
    location_id: {
      type: 'integer',
      notNull: true,
      references: '"locations"',
      onDelete: 'CASCADE',
    },
    data_type: { type: 'varchar(50)', notNull: true },
    value: { type: 'decimal(12,2)', notNull: true },
    year: { type: 'integer', notNull: true },
    month: { type: 'integer' },
    source: { type: 'varchar(100)', notNull: true },
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addConstraint('market_data', 'market_data_location_type_year_month_unique', {
    unique: ['location_id', 'data_type', 'year', 'month'],
  });

  // Create analysis_results table
  pgm.createTable('analysis_results', {
    id: 'id',
    property_id: {
      type: 'integer',
      notNull: true,
      references: '"properties"',
      onDelete: 'CASCADE',
    },
    analysis_type: { type: 'varchar(50)', notNull: true },
    input_data: { type: 'jsonb', notNull: true },
    results: { type: 'jsonb', notNull: true },
    created_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Create indexes
  pgm.createIndex('locations', ['city', 'state']);
  pgm.createIndex('locations', ['zip_code']);
  pgm.createIndex('properties', ['location_id']);
  pgm.createIndex('properties', ['price']);
  pgm.createIndex('market_data', ['location_id', 'data_type', 'year']);
  pgm.createIndex('analysis_results', ['property_id', 'analysis_type']);
};

export const down = (pgm: MigrationBuilder) => {
  pgm.dropTable('analysis_results');
  pgm.dropTable('market_data');
  pgm.dropTable('properties');
  pgm.dropTable('locations');
}; 