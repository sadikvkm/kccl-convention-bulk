import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KnexModule } from 'nest-knexjs';

@Module({
  imports: [
    KnexModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async(configService: ConfigService) => ({
        config: {
          client: 'mysql2',
          useNullAsDefault: true,
          connection: {
            host: '127.0.0.1',
            user: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_DATABASE'),
          },
        }
      }),
      inject: [ConfigService]
    }),
    ConfigModule.forRoot()
  ],
})
export class DataBaseKnex {}
