import { Controller, Get } from '@nestjs/common';
import { DocumentosService } from './shared/services/http/documentos.service';

@Controller()
export class DocumentosController {
    constructor(private readonly documentosService: DocumentosService) {}

    @Get()
    getHello(): string {
        return this.documentosService.getHello();
    }
}
