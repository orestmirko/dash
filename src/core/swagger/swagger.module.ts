import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import CONFIG from '@config';

const { HOST, PORT } = CONFIG.APP;

export const SwaggerInit = (app: NestFastifyApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Recruiter API')
    .setDescription('Recruiter API.')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Recruiter API')
    .addServer(`http://${HOST}:${PORT}`, 'Local server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};
