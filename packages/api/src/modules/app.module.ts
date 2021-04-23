import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as databaseConfig from '../config/database';
import { AudiosModule } from './audios/audios.module';
import { DocumentosModule } from './documentos/documentos.module';

import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.development.env',
        }),
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
