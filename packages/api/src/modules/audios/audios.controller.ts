import { Controller, Get } from '@nestjs/common';
import { AudiosService } from './shared/services/http/audios.service';

@Controller()
export class AudiosController {
    constructor(private readonly audiosService: AudiosService) {}

    @Get()
    getHello(): string {
        return this.audiosService.getHello();
    }

    /**
     * TODO
     * Métodos para geranciar áudios, de um documento, de um usuário.
     * Para o gerenciamento dessa entidade, será necessário o package
     * (serciço) Python, com o mesmo nome da linguagem utilizada.
     */
    // listaAudios();
    // encontraAudio();
    // criaAudio();
    // editaAudio();
    // removeAudio();
}
