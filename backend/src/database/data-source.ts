import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
config();

// SQLite-only data source for TypeORM CLI migrations
const dataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_NAME || './data/openwa.sqlite',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.DATABASE_LOGGING === 'true',
});

export default dataSource;
