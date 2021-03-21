import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as databaseConfig from '../config/database';
import { AudiosModule } from './audios/audios.module';
import { DocumentosModule } from './documentos/documentos.module';

import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(databaseConfig),
        UsuariosModule,
        DocumentosModule,
        AudiosModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
