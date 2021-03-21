import { Module } from '@nestjs/common';
import { DocumentosController } from './documentos.controller';
import { DocumentosService } from './shared/services/http/documentos.service';


@Module({
    imports: [],
    controllers: [DocumentosController],
    providers: [DocumentosService],
})
export class DocumentosModule {}
