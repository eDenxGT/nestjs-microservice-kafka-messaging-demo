import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  KAFKA_CLIENTS,
  KAFKA_TOPICS,
} from 'src/common/constants/kafka.constants';
import { MessageDto } from 'src/dto/message.dto';

@Injectable()
export class MessagesService implements OnModuleInit {
  constructor(
    @Inject(KAFKA_CLIENTS.MESSAGING_SERVICE)
    private readonly _kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this._kafkaClient.connect();
  }

  async sendMessage(payload: MessageDto) {
    await firstValueFrom(
      this._kafkaClient.emit(KAFKA_TOPICS.CLIENT_MESSAGES, payload),
    );
    return { status: 'Message sent to Kafka' };
  }
}
