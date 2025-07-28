import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KAFKA_TOPICS } from 'src/common/constants/kafka.constants';
import { MessageDto } from './dto/message.dto';
import { MessagesService } from './messages.service';
import { retryWithBackoff } from './utils/retry.util';
import { DlqMessageDto, DlqMessageEntity } from './dto/dlq-message.dto';

@Controller()
export class MessagesController {
  private readonly _logger = new Logger(MessagesController.name);
  constructor(private _messagesService: MessagesService) {}

  @MessagePattern(KAFKA_TOPICS.CLIENT_MESSAGES)
  async handleMessage(@Payload() value: MessageDto) {
    try {
      await retryWithBackoff(
        async () => await this._messagesService.handleIncomingMessage(value),
      );
    } catch (err) {
      this._logger.warn(
        `Message Failed after retries, sending to DLQ => ${JSON.stringify(value)}`,
      );

      const dlqPayload: DlqMessageDto = {
        from: value.from,
        to: value.to,
        message: value.message,
        originalTopic: KAFKA_TOPICS.CLIENT_MESSAGES,
        errorMessage: (err as Error).message ?? 'Something went wrong!',
        movedToDLQAt: new Date(),
      };

      await this._messagesService.sendToDLQ(dlqPayload);
    }
  }

  @MessagePattern(KAFKA_TOPICS.CLIENT_MESSAGES_DLQ)
  async handleDlqMessage(@Payload() value: Partial<DlqMessageEntity>) {
    await this._messagesService.handleDLQ(value);
  }
}
