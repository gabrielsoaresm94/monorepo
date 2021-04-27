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
    Res,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AudiosService } from './shared/services/http/audios.service';
import { ApiBearerAuth, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/shared/decorators/req-user.decorator';
import { DocumentosService } from '../documentos/shared/services/http/documentos.service';
import { HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { MessageStatus } from 'src/shared/erros.helper';

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
    // editaAudio();
    // removeAudio();

    @HttpCode(201)
    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Cria áudio, baseado no documento do usuário.' })
    @ApiOkResponse({
        description: 'Áudio criado com sucesso',
        type: MessageStatus,
    })
    @ApiForbiddenResponse({
        description: '[ERRO] {GET - /audios} - Acesso negado',
        schema: {
            example: {
                message:
                    '[ERRO] {GET - /audios} - Usuário não tem permissão',
                status: false,
                erro: 'Usuário não tem permissão',
            },
            type: 'MessageStatus',
        },
    })
    @ApiInternalServerErrorResponse({
        description: '[ERRO] {GET - /audios} - Erro do servidor',
        schema: {
            example: {
                message: '[ERRO] {GET - /audios} - Ocorreu um erro',
                status: false,
                erro: 'Erro ao inicializar objeto',
            },
            type: 'MessageStatus',
        },
    })
    async criaAudio(
        @Body() dadosReqCriaAudio: {documento_id: string},
        @RequestUser() usuario_id: string,
        @Res() res: Response,
    ): Promise<Response> {
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

    @HttpCode(200)
    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Lista áudios criados pelo usuário' })
    @ApiOkResponse({
        description: 'Áudios listados com sucesso',
        type: MessageStatus,
    })
    @ApiForbiddenResponse({
        description: '[ERRO] {GET - /audios - Acesso negado',
        schema: {
            example: {
                message:
                    '[ERRO] {GET - /audios - Usuário não tem permissão',
                status: false,
                erro: 'Usuário não tem permissão',
            },
            type: 'MessageStatus',
        },
    })
    @ApiInternalServerErrorResponse({
        description: '[ERRO] {GET - /audios - Erro do servidor',
        schema: {
            example: {
                message: '[ERRO] {GET - /audios - Ocorreu um erro',
                status: false,
                erro: 'Erro ao inicializar objeto',
            },
            type: 'MessageStatus',
        },
    })
    async listaAudios(
        @RequestUser() usuario_id: string,
        @Res() res: Response,
    ): Promise<Response | void> {
        try {
            const audios = await this.audiosService.listaAudios(
                usuario_id,
            );

            return res.status(HttpStatus.OK).json({
                message: '[INFO] {listaAudios} - Áudios listados com sucesso.',
                metadata: audios,
                status: true,
            });
        } catch (erro) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message:
                    '[ERRO] {listaAudios} - Problemas para listar áudios do usuário.',
                erro: erro.message,
                status: false,
            });
        }
    }

    @HttpCode(200)
    @Get(':audio_id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Encontra áudio criado pelo usuário' })
    @ApiOkResponse({
        description: 'Áudio encontrado com sucesso',
        type: MessageStatus,
    })
    @ApiForbiddenResponse({
        description: '[ERRO] {GET - /audios/{audio_id} - Acesso negado',
        schema: {
            example: {
                message:
                    '[ERRO] {GET - /audios/{audio_id} - Usuário não tem permissão',
                status: false,
                erro: 'Usuário não tem permissão',
            },
            type: 'MessageStatus',
        },
    })
    @ApiInternalServerErrorResponse({
        description: '[ERRO] {GET - /audios/{audio_id} - Erro do servidor',
        schema: {
            example: {
                message: '[ERRO] {GET - /audios/{audio_id} - Ocorreu um erro',
                status: false,
                erro: 'Erro ao inicializar objeto',
            },
            type: 'MessageStatus',
        },
    })
    async encontraAudio(
        @Param() reqEncontraAudio: { audio_id: string },
        @RequestUser() usuario_id: string,
        @Res() res: Response,
    ): Promise<Response | void> {
        try {
            const { audio_id } = reqEncontraAudio;
            const audio = await this.audiosService.encontraAudio(
                usuario_id,
                audio_id
            );

            return res.status(HttpStatus.OK).json({
                message: '[INFO] {encontraAudio} - Áudio encontrado com sucesso.',
                metadata: audio,
                status: true,
            });
        } catch (erro) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message:
                    '[ERRO] {encontraAudio} - Problemas para encontrar áudios do usuário.',
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
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Faz download do áudio criado pelo usuário' })
    @ApiOkResponse({
        description: 'Download, do áudio, realizado com sucesso',
        type: MessageStatus,
    })
    @ApiForbiddenResponse({
        description: '[ERRO] {GET - /audios/{audio_id}:download} - Acesso negado',
        schema: {
            example: {
                message:
                    '[ERRO] {GET - /audios/{audio_id}:download} - Usuário não tem permissão',
                status: false,
                erro: 'Usuário não tem permissão',
            },
            type: 'MessageStatus',
        },
    })
    @ApiInternalServerErrorResponse({
        description: '[ERRO] {GET - /audios/{audio_id}:download} - Erro do servidor',
        schema: {
            example: {
                message: '[ERRO] {GET - /audios/{audio_id}:download} - Ocorreu um erro',
                status: false,
                erro: 'Erro ao inicializar objeto',
            },
            type: 'MessageStatus',
        },
    })
    async download(
        @Param() chaveAudio: { audio_id: string },
        @RequestUser() usuario_id: string,
        @Res() res: Response,
    ): Promise<Response | void> {
        try {
            const { audio_id } = chaveAudio;

            const audio = await this.audiosService.encontraAudio(
                usuario_id,
                audio_id
            );

            const arquivo = `../../shared/audios/${audio.nome}.mp3`;

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
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Toca áudio criado pelo usuário' })
    @ApiOkResponse({
        description: 'Play, do áudio, realizado com sucesso',
        type: MessageStatus,
    })
    @ApiForbiddenResponse({
        description: '[ERRO] {GET - /audios/{audio_id}:play} - Acesso negado',
        schema: {
            example: {
                message:
                    '[ERRO] {GET - /audios/{audio_id}:play} - Usuário não tem permissão',
                status: false,
                erro: 'Usuário não tem permissão',
            },
            type: 'MessageStatus',
        },
    })
    @ApiInternalServerErrorResponse({
        description: '[ERRO] {GET - /audios/{audio_id}:play} - Erro do servidor',
        schema: {
            example: {
                message: '[ERRO] {GET - /audios/{audio_id}:play} - Ocorreu um erro',
                status: false,
                erro: 'Erro ao inicializar objeto',
            },
            type: 'MessageStatus',
        },
    })
    async play(
        @Param() chaveAudio: { audio_id: string },
        @RequestUser() usuario_id: string,
        @Res() res: Response,
    ): Promise<Response | void> {
        try {
            const { audio_id } = chaveAudio;

            const audio = await this.audiosService.encontraAudio(
                usuario_id,
                audio_id
            );

            // const buffer = 2;
            // const { audio_id } = chaveAudio;
            const arquivo = `../../shared/audios/${audio.nome}.mp3`;

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
