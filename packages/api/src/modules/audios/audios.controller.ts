import * as fs from 'fs';
import * as util from 'util';
import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Query,
    Res,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AudiosService } from './shared/services/http/audios.service';

@Controller()
export class AudiosController {
    getStat;
    constructor(private readonly audiosService: AudiosService) {
        this.getStat = util.promisify(fs.stat);
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

    @HttpCode(200)
    @Get('download')
    @UseGuards(AuthGuard('jwt'))
    async download(
        @Query() dadosReqDownload,
        @Res() res: Response,
    ): Promise<Response | void> {
        try {
            const { nome } = dadosReqDownload;

            const arquivo = `../../shared/audios/${nome}`;

            return res.download(arquivo);
        } catch (erro) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message:
                    '[ERRO] {download} - Problemas para fazer download do arquivo de áudio.',
                erro: erro.message,
                status: false,
            });
        }
    }

    @HttpCode(200)
    @Get('play')
    @UseGuards(AuthGuard('jwt'))
    async play(
        @Query() dadosReqDownload,
        @Res() res: Response,
    ): Promise<Response | void> {
        try {
            // const buffer = 2;
            const { nome } = dadosReqDownload;
            const arquivo = `../../shared/audios/${nome}`;

            const stat = await this.getStat(arquivo);

            // Informações do cabeçalho
            res.writeHead(200, {
                'Content-Type': 'audio/mp3',
                'Content-Length': stat.size,
            });

            const stream = fs.createReadStream(arquivo, /*{ highWaterMark: buffer }*/);

            stream.on('end', () => console.log('Finaliza stream'));

            // Streaming do audio
            stream.pipe(res);
        } catch (erro) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message:
                    '[ERRO] {download} - Problemas para fazer download do arquivo de áudio.',
                erro: erro.message,
                status: false,
            });
        }
    }
}
