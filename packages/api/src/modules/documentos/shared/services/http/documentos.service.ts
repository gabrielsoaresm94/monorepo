import { Injectable } from '@nestjs/common';
import Documento from '../../typeorm/entities/documento.entity';
import Pagina from '../../typeorm/entities/pagina.entity';
import { DocumentosRepository } from '../../typeorm/repositories/documentos.repository';
import { PaginasRepository } from '../../typeorm/repositories/paginas.repository';

@Injectable()
export class DocumentosService {
    constructor(
        private documentosRepository: DocumentosRepository,
        private paginasRepository: PaginasRepository,
    ) {}

    public async criaDocumento(
        chave_usuario: string,
        nome: string,
        descricao: string,
        assunto: string,
        qtd_imagens: number,
    ): Promise<Partial<Documento>> {
        /**
         * TODO:
         * Adicionar rollback para caso dê algum problema na criação,
         * procurar alguma maneira usando typeorm;
         */
        const documento = await this.documentosRepository.cria({
            nome,
            descricao: descricao || null,
            assunto: assunto || null,
            qtd_imagens,
            usuario_id: chave_usuario
        });

        return documento;
    }

    public async criaPagina(
        chave_usuario: string,
        chave_documento: string,
        nome: string,
        tamanho: string,
        formato: string,
    ): Promise<Partial<Pagina>> {
        /**
         * TODO:
         * Adicionar rollback para caso dê algum problema na criação,
         * procurar alguma maneira usando typeorm;
         */
        const pagina = await this.paginasRepository.cria({
            nome,
            tamanho: tamanho || null,
            formato,
            documento_id: chave_documento,
            usuario_id: chave_usuario
        });

        return pagina;
    }
}
