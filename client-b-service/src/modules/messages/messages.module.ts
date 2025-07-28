import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/message.schema';
import { ClientsModule } from '@nestjs/microservices';
import { KAFKA_CLIENTS } from 'src/common/constants/kafka.constants';
import { ConfigService } from '@nestjs/config';
import { kafkaProducerOptions } from 'src/config/options/kafka.options';
import {
  DeadLetterMessage,
  DeadLetterMessageSchema,
} from './schemas/dead-letter-message.schema';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: KAFKA_CLIENTS.MESSAGING_DLQ_CLIENT,
        inject: [ConfigService],
        useFactory: kafkaProducerOptions,
      },
    ]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([
      { name: DeadLetterMessage.name, schema: DeadLetterMessageSchema },
    ]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
