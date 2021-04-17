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
        const documento = await this.documentosRepository.cria({
            nome,
            descricao: descricao || null,
            assunto: assunto || null,
            qtd_imagens,
            usuario_id: chave_usuario,
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
        const pagina = await this.paginasRepository.cria({
            nome,
            tamanho: tamanho || null,
            formato,
            documento_id: chave_documento,
            usuario_id: chave_usuario,
        });

        return pagina;
    }

    public async listaDocumentos(
        usuario_id: string,
        assunto: string,
    ): Promise<Array<Documento>> {
        let documentos = await this.documentosRepository.lista(usuario_id);
        const paginas = await this.paginasRepository.lista(usuario_id);

        for (const documento of documentos) {
            documento.paginas = [];

            for (const pagina of paginas) {
                if (pagina.documento_id === documento.documento_id) {
                    documento.paginas.push(pagina);
                }
            }
        }

        documentos = !assunto ? documentos : documentos.filter((doc) => { return doc.assunto === assunto })

        return documentos;
    }

    public async encontraDocumento(
        usuario_id: string,
        documento_id: string,
    ): Promise<Documento> {
        const documento = await this.documentosRepository.encontra(
            usuario_id,
            documento_id,
        );
        const paginas = await this.paginasRepository.encontra(
            usuario_id,
            documento_id,
        );

        documento.paginas = !paginas ? [] : paginas;

        return documento;
    }
}
