import { Logger, Module } from '@nestjs/common';
import { MessagesModule } from './modules/messages/messages.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './config/kafka.config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        connectionFactory: (connection: Connection) => {
          const logger = new Logger('MongoDB');
          connection.on('connected', () =>
            logger.log('Database connected successfully'),
          );
          connection.on('error', (err) =>
            logger.error(`Database connection error: ${err}`),
          );
          connection.on('disconnected', () =>
            logger.warn('Database disconnected'),
          );

          if (connection.readyState) {
            logger.warn('Database already connected (readyState=1)');
          }

          return connection;
        },
      }),
    }),
    MessagesModule,
  ],
})
export class AppModule {}
