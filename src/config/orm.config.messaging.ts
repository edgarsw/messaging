import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { messagingEntities } from './messaging.entities';

export default registerAs(
    'orm.config',
    (): TypeOrmModuleOptions => ({
        type: 'mysql',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: messagingEntities,
        synchronize: true,  // Mantener en false para producción
        //migrationsRun: true, // Ejecuta migraciones automáticamente
        //dropSchema: true,    // Elimina todas las tablas antes de sincronizar
        autoLoadEntities: true, // Carga automáticamente las entidades registradas
    })
);
