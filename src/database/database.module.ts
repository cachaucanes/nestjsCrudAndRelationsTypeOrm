import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Client } from 'pg';
const API_KEY = '12345634';
/* client.query('SELECT * from tasks', (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Connected to database:', res.rows);
  }
}); */

const db_env = (configService: ConfigService) => {
  return {
    postgres: {
      type: 'postgres',
      host: configService.get<string>('HOST_DB'),
      port: configService.get<number>('PORT_DB') || 5432,
      username: configService.get<string>('USER_DB'),
      password: configService.get<string>('PASSWORD_DB'),
      database: configService.get<string>('NAME_DB'),
      synchronize: false,
      autoLoadEntities: true,
    },
    mysql: {
      type: 'mysql',
      host: configService.get<string>('MYSQL_HOST'),
      port: configService.get<number>('MYSQL_PORT') || 3306,
      username: configService.get<string>('MYSQL_USER'),
      password: configService.get<string>('MYSQL_ROOT_PASSWORD'),
      database: configService.get<string>('MYSQL_DATABASE'),
      synchronize: false,
      autoLoadEntities: true,
    },
  };
};

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        return db_env(configService).postgres as TypeOrmModuleOptions;
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
          user: configService.get<string>('USER_DB'),
          host: configService.get<string>('HOST_DB'),
          database: configService.get<string>('NAME_DB'),
          password: configService.get<string>('PASSWORD_DB'),
          port: configService.get<number>('PORT_DB') || 5432,
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
