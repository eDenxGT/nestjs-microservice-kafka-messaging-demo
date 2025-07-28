import { Module } from '@nestjs/common';
import { MessagesModule } from './modules/messages/messages.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/kafka.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    MessagesModule,
  ],
})
export class AppModule {}
