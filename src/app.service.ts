import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    @Inject('API_KEY') private apikey: string,
    private configService: ConfigService,
  ) {}
  getHello(): string {
    return `Hello World! Entorno: ${this.configService.get('NODE_ENV')}`;
  }
}
