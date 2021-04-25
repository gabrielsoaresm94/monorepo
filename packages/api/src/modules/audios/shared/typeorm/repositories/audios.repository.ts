import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityRepository } from 'typeorm';
import Audio from '../entities/audio.entity';

// class CriaAudio extends RequisicaoCriaDocumentoDTO {
//     usuario_id: string;
//     qtd_imagens: number;
// }

@EntityRepository(Audio)
export class AudiosRepository {
    constructor(
        @InjectRepository(Audio)
        private ormRepository: Repository<Audio>,
    ) {}

    public async cria(
        usuario_id: string,
        nome: string,
        tamanho: string,
        formato: string,
        assunto: string,
        descricao: string
    ): Promise<Audio> {
        const audio = this.ormRepository.create({
            nome: nome,
            tamanho: tamanho,
            formato: formato,
            assunto: assunto,
            descricao: descricao,
            usuario_id: usuario_id
        });

        await this.ormRepository.save(audio);

        return audio;
    }

    public async salva(audio: Audio): Promise<Audio> {
        return await this.ormRepository.save(audio);
    }
}
