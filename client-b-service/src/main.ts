import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { kafkaConsumerOptions } from './config/options/kafka.options';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const config = appContext.get(ConfigService);
  const logger = new Logger('Client B');

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      kafkaConsumerOptions(config),
    );

  microservice.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await microservice.listen();

  logger.log('Microservice Running!');
}
bootstrap();
