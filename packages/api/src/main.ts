import 'reflect-metadata';
import 'dotenv/config';

import './shared/typeorm';
import * as express from 'express';
// import * as Morgan from 'morgan';
// import { StreamOptions } from 'morgan';
// import * as Helmet from 'helmet';
// import * as rateLimit from 'express-rate-limit';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import {
    DocumentBuilder,
    SwaggerModule
} from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';

/**
 * Constantes
 */
const PORTA = 3001;
const EXECULTA_LOCAL = true;
const DESATIVA_LOG = false;
const ATIVA_LOG = true;

/**
 * Cria instância do servidor express
 */
const expressApp = express();

/**
 * Middleware que limita requisições por tempo (minutos)
 * @param expressApp
 */

/**
 * Middleware para controle de log de chamada de requisição
 * @param expressApp
 */

/**
 * Middleware para Helmet, contra ataques por cabeçalho
 * @param expressApp
 */

async function bootstrap() {
    // Helmet helmet(expressApp);

    // Logger nas requisições morgan(expressApp);

    // Rate limit rateLimit(expressApp);

    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressApp),
        {
            logger: EXECULTA_LOCAL ? ATIVA_LOG : DESATIVA_LOG,
        },
    );

    const config = new DocumentBuilder()
        .setTitle('Monorepo')
        .setDescription('API do monorepo')
        .setVersion('0.0.1')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    await app.listen(PORTA);
}
bootstrap();

