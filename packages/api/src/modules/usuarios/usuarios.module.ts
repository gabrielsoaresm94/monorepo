import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudiosService } from '../audios/shared/services/http/audios.service';
import { AudiosRepository } from '../audios/shared/typeorm/repositories/audios.repository';
import { DocumentosService } from '../documentos/shared/services/http/documentos.service';
import Documento from '../documentos/shared/typeorm/entities/documento.entity';
import Pagina from '../documentos/shared/typeorm/entities/pagina.entity';
import { DocumentosRepository } from '../documentos/shared/typeorm/repositories/documentos.repository';
import { PaginasRepository } from '../documentos/shared/typeorm/repositories/paginas.repository';
import { UsuariosService } from './shared/services/http/usuarios.service';
import Usuario from './shared/typeorm/entities/usuario.entity';
import { UsuariosRepository } from './shared/typeorm/repositories/usuarios.repository';
import { UsuariosController } from './usuarios.controller';
import Audio from '../audios/shared/typeorm/entities/audio.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Usuario]),
        TypeOrmModule.forFeature([Documento]),
        TypeOrmModule.forFeature([Pagina]),
        TypeOrmModule.forFeature([Audio]),
        HttpModule.register({
            // timeout: 5000,
            // maxRedirects: 5,
        }),
    ],
    controllers: [UsuariosController],
    providers: [UsuariosService, UsuariosRepository, DocumentosService, DocumentosRepository, AudiosService, AudiosRepository, PaginasRepository],
    exports: [UsuariosRepository],
})
export class UsuariosModule {}
