import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isProd = configService.get<string>('NODE_ENV') === 'production';
  return {
    type: 'postgres',

    ...(isProd
      ? {
          url: configService.get<string>('DATABASE_URL'),
          synchronize: false,
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : {
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT') || 5432,
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          synchronize: true,
        }),
    autoLoadEntities: true,

    logging: isProd,

    migrations: [__dirname + '/..migrations/*{.ts,.js}'],
    migrationsRun: isProd,

    extra: {
      connectionTimeoutMillis: 30000,
    },
  };
};
