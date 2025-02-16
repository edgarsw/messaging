import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { messagingEntities } from './messaging.entities';

export default registerAs(
    'orm.config',
    (): TypeOrmModuleOptions => ({
        type: 'mysql',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_EVOLUTION_USER,
        password: process.env.DATABASE_EVOLUTION_PASSWORD,
        database: process.env.DATABASE_EVOLUTION_NAME,
        entities: messagingEntities,
        synchronize: false,
        autoLoadEntities: false,
    })
);
