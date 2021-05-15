import 'reflect-metadata';
import 'dotenv/config';

import './shared/typeorm';
import * as express from 'express';
import * as Morgan from 'morgan';
import { StreamOptions } from 'morgan';
import * as Helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { PathItemObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as rateLimit from 'express-rate-limit';

/**
 * Constantes
 */
const PORTA = 3000;
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
export const middlewareRateLimit = (
    expressApp: express.Express,
): void => {

    const limiter = rateLimit({
        /**
         * Limita tempo em (15) minutos
         */
        windowMs: 15 * 60 * 1000,

        /**
         * Limita requisições por IP
         */
        max: 50,
    });

    expressApp.use(limiter);
}

/**
 * Middleware para controle de log de chamada de requisição
 * @param expressApp
 */
export const adicionaMiddlewareMorgan = (
    expressApp: express.Express,
): void => {
    const loggerStream: StreamOptions = {
        write: str => {
            console.info(str);
        },
    };

    expressApp.use(
        Morgan('combined', {
            stream: loggerStream,
        }),
    );
};

/**
 * Middleware para Helmet, contra ataques por cabeçalho
 * @param expressApp
 */
export const adicionaMiddlewareHelmet = (
    expressApp: express.Express,
): void => {
    expressApp.use(Helmet());
};

/**
 * Remove '[:]' das urls e troca por ':' para execução da documentação da API
 * @param document
 */
export const removeCaracteresEspeciaisNoPath = (
    document: OpenAPIObject,
): void => {
    const newPaths: Record<string, PathItemObject> = {};
    for (const pathKey in document.paths) {
        if (!Object.prototype.hasOwnProperty.call(document.paths, pathKey))
            continue;

        const newPathKey = pathKey.replace(/\[:]/g, ':');
        newPaths[newPathKey] = document.paths[pathKey];
    }

    document.paths = newPaths;
};

/**
 * Adiciona a documentação Live do OpenAPI
 * @param app Aplicação nest a ser buscada
 */
export const adicionaOpenAPIDocs = (
    app: INestApplication,
    info: {
        titulo: string;
        contato: {
            nome: string;
            site: string;
            email: string;
        };
        descricao: string;
    },
    port: number,
): void => {
    // Configura o documento
    const options = new DocumentBuilder()
        .setTitle(info.titulo)
        .addServer(`http://localhost:${port}`, 'Servidor de desenvolvimento')
        .setContact(info.contato.nome, info.contato.site, info.contato.email)
        .setDescription(info.descricao)
        .setVersion('0.0.1')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, options);

    // Utilidades
    removeCaracteresEspeciaisNoPath(document);

    // Exporta o documento para visualização
    SwaggerModule.setup('docs', app, document, {
        swaggerOptions: {
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
        },
    });
};

async function bootstrap() {
    // Helmet
    adicionaMiddlewareHelmet(expressApp);

    // Logger nas requisições
    adicionaMiddlewareMorgan(expressApp);

    // Rate limit
    middlewareRateLimit(expressApp);

    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressApp),
        {
            logger: EXECULTA_LOCAL ? ATIVA_LOG : DESATIVA_LOG,
        },
    );

    adicionaOpenAPIDocs(
        app,
        {
            titulo: 'Monorepo',
            contato: {
                nome: 'Monorepo',
                site: 'exemplo.dev',
                email: 'contato@exemplo.dev',
            },
            descricao: 'API do monorepo.',
        },
        PORTA,
    );

    await app.listen(PORTA);
}
bootstrap();
