import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Client } from 'pg';
const API_KEY = '12345634';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const dbType = 'postgres'; //configService.get<string>('DB_TYPE');
        if (dbType === 'postgres') {
          return {
            type: 'postgres',
            url: configService.get<string>('DATABASE_URL'),
            ssl:
              configService.get<string>('NODE_ENV') === 'production'
                ? { rejectUnauthorized: false }
                : undefined,
            synchronize: false,
            autoLoadEntities: true,
          };
        } else {
          return {
            type: 'mysql',
            host: configService.get<string>('MYSQL_HOST'),
            port: configService.get<number>('MYSQL_PORT') || 3306,
            username: configService.get<string>('MYSQL_USER'),
            password: configService.get<string>('MYSQL_ROOT_PASSWORD'),
            database: configService.get<string>('MYSQL_DATABASE'),
            synchronize: false,
            autoLoadEntities: true,
          };
        }
      },
    }),
  ], // Asegurar que las variables de entorno están disponibles
  providers: [
    {
      provide: 'API_KEY',
      useValue: API_KEY,
    },
    {
      provide: 'PG',
      inject: [ConfigService], // Inyectamos el servicio de configuración
      useFactory: async (configService: ConfigService) => {
        const client = new Client({
          connectionString: configService.get<string>('DATABASE_URL'),
          ssl:
            configService.get<string>('NODE_ENV') === 'production'
              ? { rejectUnauthorized: false }
              : undefined,
        });

        await client
          .connect()
          .then(() => console.log('✅ Connected to database'))
          .catch((err) => {
            console.error('❌ Connection error', err);
            throw err;
          });

        return client;
      },
    },
  ],
  exports: ['API_KEY', 'PG', TypeOrmModule],
})
export class DatabaseModule {}
