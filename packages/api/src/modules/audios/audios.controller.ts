import * as fs from 'fs';
import * as util from 'util';
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    Res,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AudiosService } from './shared/services/http/audios.service';
import { ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/shared/decorators/req-user.decorator';
import { DocumentosService } from '../documentos/shared/services/http/documentos.service';
import { HttpService } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // This is where I import map operator

@ApiTags('Audios')
@Controller('audios')
export class AudiosController {
    getStat;
    constructor(
        private readonly audiosService: AudiosService,
        private readonly documentosService: DocumentosService,
        private readonly httpService: HttpService,
    ) {
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

    @HttpCode(201)
    @Post()
    @UseGuards(AuthGuard('jwt'))
    async criaAudio(
        @Body() dadosReqCriaAudio,
        @RequestUser() usuario_id: string,
        @Res() res: Response,
    ) {
        try {
            const { documento_id } = dadosReqCriaAudio;
            const documento = await this.documentosService.encontraDocumento(
                usuario_id,
                documento_id,
            );

            if (!documento) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: '[ERRO] {criaAudio} - Documento não encontrado.',
                    status: false,
                });
            };

            const caminhos = [];
            for (const pagina of documento.paginas) {
                caminhos.push(pagina.nome)
            }

            const criaAudio = (await this.httpService
                .post('http://localhost:5000/audios', {
                    nome: documento.nome,
                    caminhos: caminhos,
                })
                .pipe(map(resp => resp.data))
                .toPromise()) as {
                message: string;
                metadata: { formato: string; nome: string; tamanho: number };
                status: boolean;
            };

            if (criaAudio.status) {
                const audio = await this.audiosService.criaAudio(
                    usuario_id,
                    documento_id,
                    `${criaAudio.metadata.tamanho.toFixed(2)} mb`,
                    criaAudio.metadata.formato,
                );

                if (!audio) {
                    /**
                     * TODO - Rolback
                     * acessar endpoint para remover arquivo do storage
                     */

                    return res.status(HttpStatus.BAD_REQUEST).json({
                        message: '[ERRO] {criaAudio} - Áudio já existe, impossível criar áudio novamente.',
                        status: false,
                    });
                }

                return res.status(HttpStatus.CREATED).json({
                    message: '[INFO] {criaAudio} - Áudio criado com sucesso.',
                    metadata: audio,
                    status: true,
                });
            } else {
                /**
                 * TODO - Rolback
                 * acessar endpoint para remover arquivo do storage
                 */


                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: '[ERRO] {criaAudio} - Problemas para criar áudio.',
                    status: false,
                });
            }
        } catch (erro) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: '[ERRO] {criaAudio} - Problemas para criar áudio.',
                erro: erro.message,
                status: false,
            });
        }
    }

    // @HttpCode(200)
    // @Post()
    // @UseGuards(AuthGuard('jwt'))
    // async removeAudio(
    //     @Body() dadosReqCriaAudio,
    //     @RequestUser() usuario_id: string,
    //     @Res() res: Response,
    // ) {
    //     try {
    //         const { documento_id, audio_id } = dadosReqCriaAudio;

    //         return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    //             message: '[INFO] {removeAudio} - Áudio removido com sucesso.',
    //             metadata: {},
    //             status: false,
    //         });
    //     } catch (erro) {
    //         return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    //             message: '[ERRO] {removeAudio} - Problemas para remover áudio.',
    //             erro: erro.message,
    //             status: false,
    //         });
    //     }
    // }

    @HttpCode(200)
    @Get(':audio_id[:]download')
    @UseGuards(AuthGuard('jwt'))
    async download(
        @Param() chaveAudio: { audio_id: string },
        @Query() dadosReqDownload,
        @Res() res: Response,
    ): Promise<Response | void> {
        try {
            const { audio_id } = chaveAudio;
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
    @Get(':audio_id[:]play')
    @UseGuards(AuthGuard('jwt'))
    async play(
        @Param() chaveAudio: { audio_id: string },
        @Query() dadosReqDownload,
        @Res() res: Response,
    ): Promise<Response | void> {
        try {
            // const buffer = 2;
            const { audio_id } = chaveAudio;
            const { nome } = dadosReqDownload;
            const arquivo = `../../shared/audios/${nome}`;

            const stat = await this.getStat(arquivo);

            // Informações do cabeçalho
            res.writeHead(200, {
                'Content-Type': 'audio/mp3',
                'Content-Length': stat.size,
            });

            const stream = fs.createReadStream(
                arquivo /*{ highWaterMark: buffer }*/,
            );

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
