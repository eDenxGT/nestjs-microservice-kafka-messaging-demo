import { Logger } from '@nestjs/common';
const logger = new Logger('Retry');

export async function retryWithBackoff<T>(
  handler: () => Promise<T>,
  retries = 3,
  delay = 1000,
): Promise<T> {
  try {
    return await handler();
  } catch (err) {
    if (retries === 0) throw err;

    logger.warn(
      `Retrying to run ${handler.name} for the ${4 - retries} time with a delay of 2 seconds!`,
    );

    await new Promise((res) => setTimeout(res, delay));
    return retryWithBackoff(handler, retries - 1, delay * 2);
  }
}
