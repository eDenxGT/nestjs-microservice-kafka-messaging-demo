import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Message, MessageDocument } from './schemas/message.schema';
import { Model } from 'mongoose';
import { MessageEntity } from './dto/message.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  KAFKA_CLIENTS,
  KAFKA_TOPICS,
} from 'src/common/constants/kafka.constants';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { DlqMessageDto, DlqMessageEntity } from './dto/dlq-message.dto';
import {
  DeadLetterMessage,
  DLQDocument,
} from './schemas/dead-letter-message.schema';

@Injectable()
export class MessagesService implements OnModuleInit {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    @Inject(KAFKA_CLIENTS.MESSAGING_DLQ_CLIENT)
    private readonly _dlqClient: ClientKafka,
    @InjectModel(Message.name)
    private readonly _messageModel: Model<MessageDocument>,
    @InjectModel(DeadLetterMessage.name)
    private readonly _dlqMessageModel: Model<DLQDocument>,
  ) {}

  async onModuleInit() {
    await this._dlqClient.connect();
  }

  async handleIncomingMessage(payload: MessageEntity): Promise<void> {
    // ? Uncomment this to test Retry & DLQ functionality
    // const customError = true;
    // if (customError)
    //   throw new BadRequestException(
    //     `CUSTOM ERROR THROWed at ${MessagesService.name}`,
    //   );

    if (payload.to !== 'client-b') {
      this.logger.warn(
        `Ignored message bcz not meant for the client-b: its actually sent to => ${payload.to}`,
      );
      return;
    }

    this.logger.debug(
      `Saving message from ${payload.from}: ${payload.message}`,
    );

    await this._messageModel.create(payload);
  }

  async sendToDLQ(payload: DlqMessageDto) {
    await firstValueFrom(
      this._dlqClient.emit(KAFKA_TOPICS.CLIENT_MESSAGES_DLQ, payload),
    );
  }

  async handleDLQ(payload: Partial<DlqMessageEntity>) {
    this.logger.debug('Saving log onto Dead Letter Message Collection');
    await this._dlqMessageModel.create(payload);
  }
}
