import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityRepository } from 'typeorm';
import Pagina from '../entities/pagina.entity';

class CriaPagina {
    nome: string;
    tamanho: string | null;
    formato: string;
    documento_id: string;
    usuario_id: string;
}

@EntityRepository(Pagina)
export class PaginasRepository {
    constructor(
        @InjectRepository(Pagina)
        private ormRepository: Repository<Pagina>,
    ) {}

    public async cria(
        dadosPagina: CriaPagina,
    ): Promise<Partial<Pagina>> {
        const pagina = this.ormRepository.create(dadosPagina);

        await this.ormRepository.save(pagina);

        // const pagina = dadosPagina;

        return pagina;
    }
}
