import { Injectable } from '@nestjs/common';
import Audio from '../../typeorm/entities/audio.entity';
import { DocumentosRepository } from 'src/modules/documentos/shared/typeorm/repositories/documentos.repository';
import { AudiosRepository } from '../../typeorm/repositories/audios.repository';

@Injectable()
export class AudiosService {
    constructor(
        private documentosRepository: DocumentosRepository,
        private audiosRepository: AudiosRepository,
    ) {}

    public async criaAudio(
        usuario_id: string,
        documento_id: string,
        tamanho: string,
        formato: string,
    ): Promise<Audio | null> {
        const documento = await this.documentosRepository.encontra(
            usuario_id,
            documento_id,
        );

        if (documento.audio_id) {
            return null;
        }

        const audio = await this.audiosRepository.cria(
            usuario_id,
            documento.nome,
            tamanho,
            formato,
            documento.assunto,
            documento.descricao,
        );

        documento.audio_id = audio.audio_id;
        await this.documentosRepository.salva(documento);

        return audio;
    }

    public async encontraAudio(
        usuario_id: string,
        audio_id: string,
    ): Promise<Audio> {
        const audio = await this.audiosRepository.encontra(
            usuario_id,
            audio_id,
        );

        return audio;
    }

    public async listaAudios(
        usuario_id: string,
    ): Promise<Array<Audio>> {
        const audios = await this.audiosRepository.lista(
            usuario_id,
        );

        return audios;
    }
}
