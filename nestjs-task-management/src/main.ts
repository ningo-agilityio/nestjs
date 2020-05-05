import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const serverConfig = config.get('server');

  if (process.env.PROCESS_ENV === 'development') {
    app.enableCors();
  } else {
    app.enableCors({ origin: serverConfig.origin });
  }

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  new Logger("bootstrap").log(`App is listening on port ${port}`);
}
bootstrap();
