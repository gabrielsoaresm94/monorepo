import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityRepository } from 'typeorm';
import { RequisicaoCriaDocumentoDTO } from '../../dtos/req-post.dto';
import Documento from '../entities/documento.entity';

class CriaDocumento extends RequisicaoCriaDocumentoDTO {
    usuario_id: string;
    qtd_imagens: number;
}

@EntityRepository(Documento)
export class DocumentosRepository {
    constructor(
        @InjectRepository(Documento)
        private ormRepository: Repository<Documento>,
    ) {}

    public async cria(
        dadosReqDocumento: CriaDocumento,
    ): Promise<Partial<Documento>> {
        const documento = this.ormRepository.create(dadosReqDocumento);

        await this.ormRepository.save(documento);

        return documento;
    }

    public async lista(usuario_id: string): Promise<Array<Documento>> {
        const documentos = await this.ormRepository.find({
            where: [{ usuario_id: usuario_id }],
        });

        return documentos;
    }

    public async encontra(
        usuario_id: string,
        documento_id: string,
    ): Promise<Documento> {
        const documento = await this.ormRepository.find({
            where: [{ usuario_id: usuario_id, documento_id: documento_id }],
        });

        const documentoEncontrado = documento[0];

        return documentoEncontrado;
    }
}
