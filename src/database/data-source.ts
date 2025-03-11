import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

// Carga el archivo .env.development
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

console.log('entorno', process.env.NODE_ENV);

export default new DataSource({
  type: 'postgres',
  host: process.env.HOST_DB,
  port: Number(process.env.PORT_DB),
  username: process.env.USER_DB,
  password: process.env.PASSWORD_DB,
  database: process.env.NAME_DB,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
});
