import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MessagingModule } from './messaging/messaging.module';
import ormConfigMessaging from './config/orm.config.messaging';
import ormConfigMessagingProd from './config/orm.config.messaging.prod';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV !== 'production' ? '.env.development' : '.env.production',
      load: [
        process.env.NODE_ENV !== 'production' ? ormConfigMessaging : ormConfigMessagingProd
      ],
      expandVariables: true,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: process.env.NODE_ENV !== 'production'
        ? ormConfigMessaging : ormConfigMessagingProd
    }),

    MessagingModule,
  ],
})
export class AppModule { }
