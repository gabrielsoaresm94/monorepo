/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import express from 'express';
import * as rateLimit from 'express-rate-limit';
import * as Morgan from 'morgan';
import { StreamOptions } from 'morgan';
import * as Helmet from 'helmet';
import {
    INestApplication,
    ValidationError,
    ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { PathItemObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { minutosToMs } from './shared/functions/utils';
// import { ValidationException } from './shared/exceptions/validation.exception';
// import { ValidationFilter } from './shared/filters/validation.filter';
// import { ExpiredUserTokenFilter } from './shared/filters/expiredUserToken.filter';
// import { AuthInvalidUserTokenFilter } from './shared/filters/authInvalidUserToken.filter';

// Constantes ativação de Log
const DESATIVAR_LOG_NEST = false;
const ATIVAR_LOG_NEST = undefined;

interface InfoDocs {
    titulo: string;
    contato: {
        nome: string;
        site: string;
        email: string;
    };
    descricao: string;
    base: string;
}

const init = {
    reqLimits: {
        minutos: 10,
        max: 50,
    },
    cors: {
        origens: '*',
        // [
        // 	'http://localhost:4201',
        // 	'http://localhost:4200',
        // 	'http://pepsfield-prod.firebaseapp.com',
        // 	'https://pepsfield-prod.firebaseapp.com',
        // 	'http://admin.pepsfield.com.br',
        // ]
    },
};

/**
 * Middleware para controle de ataque de negação de serviço através de múltiplas requisições
 * @param expressInstance
 */
export const adicionaMiddlewareRateLimit = (
    expressInstance: express.Express,
): void => {
    const reqLimits = {
        /**
         * Define a janela de tempo em ms para cada evento de limite
         */
        windowMs: minutosToMs(init.reqLimits.minutos),

        /**
         * Limita cada IP a úm certo número de requisições
         */
        max: init.reqLimits.max,
    };

    // TODO
    // expressInstance.use(new rateLimit(reqLimits));
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
    info: InfoDocs,
    port,
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

/**
 * Cria servidor Nest
 * @param expressInstance
 * @param env
 */
export const criaServidorNest = async (
    expressInstance: express.Express,
    module,
    port: number,
    info?: InfoDocs,
): Promise<INestApplication> => {
    const executandoLocalmente =
        process.env.GCLOUD_PROJECT == null ||
        process.env.GCLOUD_PROJECT === 'undefined';

    // Importa o helmet para proteger vulnerabilidades conhecidas do HTTP
    adicionaMiddlewareHelmet(expressInstance);

    // Ativa o logger das requisições
    adicionaMiddlewareMorgan(expressInstance);

    // Adiciona o rate limit para um controle mais preciso da segurança da API
    adicionaMiddlewareRateLimit(expressInstance);

    // Cria instância do nest usando o express como servidor
    const app = await NestFactory.create(
        module,
        new ExpressAdapter(expressInstance),
        {
            logger: executandoLocalmente ? ATIVAR_LOG_NEST : DESATIVAR_LOG_NEST,
        },
    );

    // Customizando o retorno de APIs
    // app.useGlobalFilters(
    //     new ValidationFilter(),
    //     new ExpiredUserTokenFilter(),
    //     new AuthInvalidUserTokenFilter()
    // );
    app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory: (errors: ValidationError[]) => {
                const messages = errors.map(
                    error =>
                        `Propriedade (${error.property}) inválida: ${
                            error.value
                        }[${typeof error.value}], ${Object.values(
                            error.constraints,
                        ).join(', ')}`,
                );

                // return new ValidationException(messages);

                return messages;
            },
        }),
    );

    // Configura a documentação ao vivo do OpenAPI
    !!info === true ? adicionaOpenAPIDocs(app, info, port) : null;

    // Ativa o cors
    app.enableCors({
        origin: init.cors.origens,
    });

    // Não se executa dentro do ambiente do firebase criar if para rodar localmente
    // OBS!: Não edite a comparação abaixo só aceite ela.
    if (executandoLocalmente) {
        await app.listen(port);
        console.log(`Nest is running on localhost:${port}`);
    }

    return app;
};
