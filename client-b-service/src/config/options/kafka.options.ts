import { ConfigService } from '@nestjs/config';
import {
  ClientOptions,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';

export const kafkaConsumerOptions = (
  config: ConfigService,
): MicroserviceOptions => ({
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'client-b',
      brokers: [config.get<string>('KAFKA_BROKER', 'localhost:9092')],
    },
    consumer: {
      groupId: 'client-b-group',
    },
  },
});

export function kafkaProducerOptions(config: ConfigService): ClientOptions {
  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'client-b-pro',
        brokers: [config.get<string>('KAFKA_BROKER', 'localhost:9092')],
      },
      producerOnlyMode: true,
    },
  };
}
