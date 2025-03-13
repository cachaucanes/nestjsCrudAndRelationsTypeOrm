import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { MorganModule, MorganInterceptor } from 'nest-morgan';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'staging')
          .default('development'),
        PORT: Joi.number().required().default(3000),
        NAME_DB: Joi.string().required(),
      }),
    }),
    MorganModule,
    TasksModule,
    UsersModule,
    ProductsModule,
    DatabaseModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('tiny'),
    },
  ],
})
export class AppModule {
  /* private client: Client;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    // Conectar a PostgreSQL con valores desde ConfigService
    this.client = new Client({
      user: this.configService.get('USER_DB'),
      host: this.configService.get('HOST_DB'),
      database: this.configService.get('NAME_DB'),
      password: this.configService.get('PASSWORD_DB'),
      port: this.configService.get<number>('PORT_DB'),
    });

    await this.client.connect();
    this.client.query('SELECT * from tasks', (err, res) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Connected to database:', res.rows);
      }
    });
  } */
}
