import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
  * Custom configuration of TypeORM using environment.
**/
@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
	/**
  	  * NestJS default Configuration Service
	**/
	@Inject(ConfigService)
	private readonly config: ConfigService;

  /**
    * Create TypORM module options.
	* Please note that the synchronize value is set to TRUE.
    * @returns {TypeOrmModuleOptions} parametered TypORM module options.
  **/
  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.get<string>('DATABASE_HOST'),
      port: this.config.get<number>('DATABASE_PORT'),
      database: this.config.get<string>('DATABASE_NAME'),
      username: this.config.get<string>('DATABASE_USER'),
      password: this.config.get<string>('DATABASE_PASSWORD'),
      entities: ['dist/**/*.entity.{ts,js}'],
      migrations: ['dist/migrations/*.{ts,js}'],
      migrationsTableName: 'typeorm_migrations',
      logger: 'file',
      synchronize: true, // never use TRUE in production!
    };
  }
}