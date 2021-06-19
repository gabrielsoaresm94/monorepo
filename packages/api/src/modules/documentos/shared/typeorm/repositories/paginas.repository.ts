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

    public async cria(dadosPagina: CriaPagina): Promise<Partial<Pagina>> {
        const pagina = this.ormRepository.create(dadosPagina);

        await this.ormRepository.save(pagina);

        return pagina;
    }

    public async lista(usuario_id: string): Promise<Array<Pagina>> {
        const paginas = await this.ormRepository.find({
            where: [{ usuario_id: usuario_id }],
        });

        return paginas;
    }

    public async encontra(
        usuario_id: string,
        documento_id: string,
    ): Promise<Array<Pagina>> {
        const paginas = await this.ormRepository.find({
            where: [{ usuario_id: usuario_id, documento_id: documento_id }],
        });

        return paginas;
    }

    // TODO - adicionar usuario_id, para consulta
    public async remove(pagina_id: string): Promise<void> {
        await this.ormRepository.delete({ pagina_id: pagina_id });
    }
}
