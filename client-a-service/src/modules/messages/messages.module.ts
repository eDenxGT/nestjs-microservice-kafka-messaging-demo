import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { kafkaOptions } from 'src/config/options/kafka-options';
import { KAFKA_CLIENTS } from 'src/common/constants/kafka.constants';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: KAFKA_CLIENTS.MESSAGING_SERVICE,
        inject: [ConfigService],
        useFactory: kafkaOptions,
      },
    ]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
