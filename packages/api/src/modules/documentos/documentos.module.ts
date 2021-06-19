import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudiosService } from '../audios/shared/services/http/audios.service';
import { AudiosRepository } from '../audios/shared/typeorm/repositories/audios.repository';
import { DocumentosController } from './documentos.controller';
import { DocumentosService } from './shared/services/http/documentos.service';
import Documento from './shared/typeorm/entities/documento.entity';
import Pagina from './shared/typeorm/entities/pagina.entity';
import { DocumentosRepository } from './shared/typeorm/repositories/documentos.repository';
import { PaginasRepository } from './shared/typeorm/repositories/paginas.repository';
import Audio from '../audios/shared/typeorm/entities/audio.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Documento]),
        TypeOrmModule.forFeature([Pagina]),
        TypeOrmModule.forFeature([Audio]),
        HttpModule.register({
            // timeout: 5000,
            // maxRedirects: 5,
        }),
    ],
    controllers: [DocumentosController],
    providers: [DocumentosService, DocumentosRepository, AudiosService, AudiosRepository, PaginasRepository],
    exports: [DocumentosRepository, PaginasRepository],
})
export class DocumentosModule {}
