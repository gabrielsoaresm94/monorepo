import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Audio from './shared/typeorm/entities/audio.entity';
import { AudiosController } from './audios.controller';
import { AudiosService } from './shared/services/http/audios.service';
import { AudiosRepository } from './shared/typeorm/repositories/audios.repository';
import Documento from '../documentos/shared/typeorm/entities/documento.entity';
import { DocumentosService } from '../documentos/shared/services/http/documentos.service';
import { DocumentosRepository } from '../documentos/shared/typeorm/repositories/documentos.repository';
import Pagina from '../documentos/shared/typeorm/entities/pagina.entity';
import { PaginasRepository } from '../documentos/shared/typeorm/repositories/paginas.repository';


@Module({
    imports: [
        TypeOrmModule.forFeature([Audio]),
        TypeOrmModule.forFeature([Documento]),
        TypeOrmModule.forFeature([Pagina]),
        HttpModule.register({
            // timeout: 5000,
            // maxRedirects: 5,
        }),
    ],
    controllers: [AudiosController],
    providers: [AudiosService, AudiosRepository, DocumentosService, DocumentosRepository, PaginasRepository],
})
export class AudiosModule {}
