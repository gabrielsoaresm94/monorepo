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
        descricao: string,
    ): Promise<Audio> {
        const audio = this.ormRepository.create({
            nome: nome,
            tamanho: tamanho,
            formato: formato,
            assunto: assunto,
            descricao: descricao,
            usuario_id: usuario_id,
        });

        await this.ormRepository.save(audio);

        return audio;
    }

    public async salva(audio: Audio): Promise<Audio> {
        return await this.ormRepository.save(audio);
    }

    public async encontra(
        usuario_id: string,
        audio_id: string,
    ): Promise<Audio> {
        const audio = await this.ormRepository.find({
            where: [{ usuario_id: usuario_id, documento_id: audio_id }],
        });

        const audioEncontrado = audio[0];

        return audioEncontrado;
    }

    public async lista(usuario_id: string): Promise<Array<Audio>> {
        const audios = await this.ormRepository.find({
            where: [{ usuario_id: usuario_id }],
        });

        return audios;
    }
}
