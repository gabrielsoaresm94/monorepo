import 'reflect-metadata';
import 'dotenv/config';

// import { servidorNest } from './main.utils';
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
// import { minutosToMs } from './shared/functions/utils';
import { ExpressAdapter } from '@nestjs/platform-express';
// import rateLimit from 'express-rate-limit';

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
const expressInstance = express();

const infoOpenApi = {
    titulo: 'Monorepo',
    contato: {
        nome: 'Monorepo',
        site: 'exemplo.dev',
        email: 'contato@exemplo.dev',
    },
    descricao: 'API do monorepo.',
};

// const init = {
//     reqLimits: {
//         minutos: 10,
//         max: 50,
//     },
//     cors: {
//         origens: '*',
//         // [
//         // 	'http://localhost:4201',
//         // 	'http://localhost:4200',
//         // ]
//     },
// };

/**
 * Middleware para controle de ataque de negação de serviço através de múltiplas requisições
 * @param expressInstance
 */
export const adicionaMiddlewareRateLimit = (
    expressInstance: express.Express,
): void => {
    // const reqLimits = {
    //     /**
    //      * Define a janela de tempo em ms para cada evento de limite
    //      */
    //     windowMs: minutosToMs(init.reqLimits.minutos),

    //     /**
    //      * Limita cada IP a úm certo número de requisições
    //      */
    //     max: init.reqLimits.max,
    // } as rateLimit.Options;

    // expressInstance.use(rateLimit(reqLimits));
    expressInstance.set('trust proxy', 1);
};

/**
 * Middleware para controle de log de chamada de requisição
 * @param expressInstance
 */
export const adicionaMiddlewareMorgan = (
    expressInstance: express.Express,
): void => {
    const loggerStream: StreamOptions = {
        write: str => {
            console.info(str);
        },
    };

    expressInstance.use(
        Morgan('combined', {
            stream: loggerStream,
        }),
    );
};

/**
 * Adiciona middleware Helmet para remoção de ataques simples por meio de cabeçalho
 * @param expressInstance
 */
export const adicionaMiddlewareHelmet = (
    expressInstance: express.Express,
): void => {
    expressInstance.use(Helmet());
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
        titulo: string,
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
    // Importa o helmet para proteger vulnerabilidades conhecidas do HTTP
    adicionaMiddlewareHelmet(expressInstance);

    // Ativa o logger das requisições
    adicionaMiddlewareMorgan(expressInstance);

    // Adiciona o rate limit para um controle mais preciso da segurança da API
    adicionaMiddlewareRateLimit(expressInstance);

    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressInstance),
        {
            logger: EXECULTA_LOCAL ? ATIVA_LOG : DESATIVA_LOG,
        },
    );

    adicionaOpenAPIDocs(app, infoOpenApi, PORTA);

    await app.listen(PORTA);
}
bootstrap();
