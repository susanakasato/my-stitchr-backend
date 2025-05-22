import { NestFactory } from '@nestjs/core';
import { PatternModule } from "./module/pattern.module.js";

async function bootstrap() {
  const app = await NestFactory.create(PatternModule);
  app.enableCors({
    origin: "https://mystitchr.com"
  })
  await app.listen(3000);
}
bootstrap();
