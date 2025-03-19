import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
//Migrations
// Carga el archivo .env.development
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

console.log('entorno', process.env.NODE_ENV);

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : undefined,
});
