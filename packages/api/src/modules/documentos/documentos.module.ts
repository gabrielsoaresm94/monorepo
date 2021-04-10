import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentosController } from './documentos.controller';
import { DocumentosService } from './shared/services/http/documentos.service';
import Documento from './shared/typeorm/entities/documento.entity';
import Pagina from './shared/typeorm/entities/pagina.entity';
import { DocumentosRepository } from './shared/typeorm/repositories/documentos.repository';
import { PaginasRepository } from './shared/typeorm/repositories/paginas.repository';


@Module({
    imports: [TypeOrmModule.forFeature([Documento]), TypeOrmModule.forFeature([Pagina])],
    controllers: [DocumentosController],
    providers: [DocumentosService, DocumentosRepository, PaginasRepository],
    exports: [DocumentosRepository, PaginasRepository]
})
export class DocumentosModule {}
