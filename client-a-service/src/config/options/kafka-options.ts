import { ConfigService } from '@nestjs/config';
import { ClientOptions, Transport } from '@nestjs/microservices';

export function kafkaOptions(config: ConfigService): ClientOptions {
  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'client-a',
        brokers: [config.get<string>('KAFKA_BROKER', 'localhost:9092')],
      },
      producerOnlyMode: true,
    },
  };
}
