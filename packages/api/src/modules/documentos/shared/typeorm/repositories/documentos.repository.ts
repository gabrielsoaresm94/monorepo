import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityRepository } from 'typeorm';
import { RequisicaoCriaDocumentoDTO } from '../../dtos/req-post.dto';
import Documento from '../entities/documento.entity';

class CriaDocumento extends RequisicaoCriaDocumentoDTO {
    usuario_id: string;
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
        // const documento = this.ormRepository.create(dadosReqDocumento);

        // await this.ormRepository.save(documento);

        const documento = dadosReqDocumento;

        return documento;
    }
}
