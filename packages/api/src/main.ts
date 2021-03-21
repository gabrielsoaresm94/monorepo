// import 'reflect-metadata';
// import { AppModule } from './modules/app.module';
// import express from 'express';
// import { criaServidorNest } from './main.utils';
// import './shared/typeorm';

// /**
//  * Cria instância do servidor express
//  */
// const app = express();

// const infoOpenApi = {
//     contato: {
//         nome: 'Monorepo',
//         site: 'exemplo.dev',
//         email: 'contato@exemplo.dev',
//     },
//     descricao: 'API do monorepo.',
// };

// criaServidorNest(app, AppModule, 3000, {
//     ...infoOpenApi,
//     titulo: 'Monorepo - API',
//     base: 'api',
// })
//     .then(async nestApp => {
//         /**
//          * Inicializa a aplicação nest
//          */
//         await nestApp.init();

//         console.log('API iniciada.');
//     })
//     .catch(err => console.error('Problemas com API: ', err.message));


import { NestFactory } from '@nestjs/core';
import { UsuariosModule } from './modules/usuarios/usuarios.module';

async function bootstrap() {
  const app = await NestFactory.create(UsuariosModule);
  await app.listen(3000);
}
bootstrap();
