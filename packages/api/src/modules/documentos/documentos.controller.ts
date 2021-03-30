import { Controller, Get } from '@nestjs/common';
import { DocumentosService } from './shared/services/http/documentos.service';

@Controller()
export class DocumentosController {
    constructor(private readonly documentosService: DocumentosService) {}

    /**
     * TODO
     * Métodos para geranciar documentos, de um usuário,
     * que contém 1 ou N páginas.
     */
    // listaDocumentos();
    // encontraDocumento();
    // criaDocumento();
    // editaDocumento();
    // removeDocumento();
}
