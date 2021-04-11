import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as databaseConfig from '../config/database';
import { AudiosModule } from './audios/audios.module';
import { DocumentosModule } from './documentos/documentos.module';

import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(databaseConfig),
        UsuariosModule,
        DocumentosModule,
        AudiosModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
