import fs from 'fs';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpService,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Res,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express/multer';
import { ApiBearerAuth, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/shared/functions/utils';
import { DocumentosService } from './shared/services/http/documentos.service';
import { RequestUser } from 'src/shared/decorators/req-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/guards/roles.decorator';
import { Role } from 'src/shared/guards/ role.enum';
import { RequisicaoCriaDocumentoDTO } from './shared/dtos/req-post.dto';
import { RequisicaoEncontraDocumentoDTO, RequisicaoListaDocumentosDTO } from './shared/dtos/req-get.dto';
import { MessageStatus } from 'src/shared/erros.helper';
import { map } from 'rxjs/operators';
import { AudiosService } from '../audios/shared/services/http/audios.service';

@ApiTags('Documentos')
@Controller('documentos')
export class DocumentosController {
    constructor(
        private readonly documentosService: DocumentosService,
        private readonly audiosService: AudiosService,
        private readonly httpService: HttpService,
    ) {}

    /**
     */
    // removeDocumento();

    /**
     * TODO - Caso o documento contenha um áudio criado, editá-lo tbm.
     */
    @HttpCode(200)
    @Put(':documento_id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.USUARIO)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Edita documento do usuário' })
    @ApiOkResponse({
        description: 'Documento editado com sucesso',
        type: MessageStatus,
    })
    @ApiForbiddenResponse({
        description: '[ERRO] {PUT - /documentos/{documento_id}} - Acesso negado',
        schema: {
            example: {
                message:
                    '[ERRO] {PUT - /documentos/{documento_id}} - Usuário não tem permissão',
                status: false,
                erro: 'Usuário não tem permissão',
            },
            type: 'MessageStatus',
        },
    })
    @ApiInternalServerErrorResponse({
        description: '[ERRO] {PUT - /documentos/{documento_id}} - Erro do servidor',
        schema: {
            example: {
                message: '[ERRO] {PUT - /documentos/{documento_id}} - Ocorreu um erro',
                status: false,
                erro: 'Erro ao inicializar objeto',
            },
            type: 'MessageStatus',
        },
    })
    async editaDocumento(
        @Param() chaveDocumento: RequisicaoEncontraDocumentoDTO,
        @RequestUser() usuario_id: string,
        @Body() dadosReqUsuario: RequisicaoCriaDocumentoDTO,
        @Res() res: Response,
    ): Promise<Response> {
        try {
            const { documento_id } = chaveDocumento;
            const { nome, descricao, assunto } = dadosReqUsuario;

            const documentoEditado = await this.documentosService.editaDocumento(
                usuario_id,
                documento_id,
                nome,
                descricao,
                assunto,
            );

            return res.status(HttpStatus.OK).json({
                message:
                    '[INFO] {editaDocumento} - Documento editado com sucesso.',
                metadata: documentoEditado,
                status: true,
            });
        } catch (erro) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message:
                    '[ERRO] {editaDocumento} - Problemas para editar documento.',
                erro: erro.message,
                status: false,
            });
        }
    }

    @HttpCode(200)
    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.USUARIO)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Lista documentos do usuário' })
    @ApiOkResponse({
        description: 'Documentos listados com sucesso',
        type: MessageStatus,
    })
    @ApiForbiddenResponse({
        description: '[ERRO] {GET - /documentos} - Acesso negado',
        schema: {
            example: {
                message:
                    '[ERRO] {GET - /documentos} - Usuário não tem permissão',
                status: false,
                erro: 'Usuário não tem permissão',
            },
            type: 'MessageStatus',
        },
    })
    @ApiInternalServerErrorResponse({
        description: '[ERRO] {GET - /documentos} - Erro do servidor',
        schema: {
            example: {
                message: '[ERRO] {GET - /documentos} - Ocorreu um erro',
                status: false,
                erro: 'Erro ao inicializar objeto',
            },
            type: 'MessageStatus',
        },
    })
    async listaDocumentos(
        @Query() dadosReqListaDocumentos: RequisicaoListaDocumentosDTO,
        @RequestUser() usuario_id: string,
        @Res() res: Response,
    ): Promise<Response> {
        try {
            const { assunto } = dadosReqListaDocumentos;

            const documentos = await this.documentosService.listaDocumentos(
                usuario_id,
                assunto,
            );

            return res.status(HttpStatus.OK).json({
                message:
                    '[INFO] {listaDocumentos} - Documentos listados com sucesso.',
                metadata: documentos,
                status: true,
            });
        } catch (erro) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message:
                    '[ERRO] {listaDocumentos} - Problemas para listar documentos.',
                erro: erro.message,
                status: false,
            });
        }
    }

    @HttpCode(200)
    @Get(':documento_id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.USUARIO)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Encontra documento do usuário' })
    @ApiOkResponse({
        description: 'Documento encontrado com sucesso',
        type: MessageStatus,
    })
    @ApiForbiddenResponse({
        description: '[ERRO] {GET - /documentos/{documento_id}} - Acesso negado',
        schema: {
            example: {
                message:
                    '[ERRO] {GET - /documentos/{documento_id}} - Usuário não tem permissão',
                status: false,
                erro: 'Usuário não tem permissão',
            },
            type: 'MessageStatus',
        },
    })
    @ApiInternalServerErrorResponse({
        description: '[ERRO] {GET - /documentos/{documento_id}} - Erro do servidor',
        schema: {
            example: {
                message: '[ERRO] {GET - /documentos/{documento_id}} - Ocorreu um erro',
                status: false,
                erro: 'Erro ao inicializar objeto',
            },
            type: 'MessageStatus',
        },
    })
    async encontraDocumento(
        @Param() chaveDocumento: RequisicaoEncontraDocumentoDTO,
        @RequestUser() usuario_id: string,
        @Res() res: Response,
    ): Promise<Response> {
        try {
            const { documento_id } = chaveDocumento;
            const documento = await this.documentosService.encontraDocumento(
                usuario_id,
                documento_id,
            );

            return res.status(HttpStatus.OK).json({
                message:
                    '[INFO] {encontraDocumento} - Documento encotrado com sucesso.',
                metadata: documento,
                status: true,
            });
        } catch (erro) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message:
                    '[ERRO] {encontraDocumento} - Problemas para encontrar documento.',
                erro: erro.message,
                status: false,
            });
        }
    }

    @HttpCode(201)
    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.USUARIO)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Cria documento' })
    @ApiOkResponse({
        description: 'Documento criado com sucesso',
        type: MessageStatus,
    })
    @ApiForbiddenResponse({
        description: '[ERRO] {POST - /documentos} - Acesso negado',
        schema: {
            example: {
                message:
                    '[ERRO] {POST - /documentos} - Usuário não tem permissão',
                status: false,
                erro: 'Usuário não tem permissão',
            },
            type: 'MessageStatus',
        },
    })
    @ApiInternalServerErrorResponse({
        description: '[ERRO] {POST - /documentos} - Erro do servidor',
        schema: {
            example: {
                message: '[ERRO] {POST - /documentos} - Ocorreu um erro',
                status: false,
                erro: 'Erro ao inicializar objeto',
            },
            type: 'MessageStatus',
        },
    })
    @UseInterceptors(
        FilesInterceptor('image', 10, {
            storage: diskStorage({
                destination: '../../shared/images', // || Amazon S3, TODO - pesquisar sobre
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async criaDocumento(
        @Query() dadosReqCriaDocumento: RequisicaoCriaDocumentoDTO,
        @UploadedFiles()
        paginas: Array<{
            fieldname: string; // image
            originalname: string;
            encoding: string;
            mimetype: string; // image/png
            destination: string;
            filename: string;
            path: string;
            size: number;
        }>,
        @RequestUser() usuario_id: string,
        @Res() res: Response,
    ): Promise<Response> {
        try {
            const { nome, descricao, assunto } = dadosReqCriaDocumento;

            /**
             * Adiciona propriedades das imagens enviadas,
             * no vetor
             */
            const imagens = [];
            paginas.forEach(file => {
                const fileReponse = {
                    nome_original: file.originalname,
                    nome_arquivo: file.filename,
                    size: file.size / (1024 * 1024),
                    format: file.mimetype,
                };
                imagens.push(fileReponse);
            });

            const documento = await this.documentosService.criaDocumento(
                usuario_id,
                nome,
                descricao,
                assunto,
                imagens.length,
            );

            if (documento) {
                for (const objPagina of imagens) {
                    const nome = objPagina.nome_arquivo;
                    const tamanho = `${objPagina.size.toFixed(2)} mb`;
                    const formato = objPagina.format;

                    const pagina = await this.documentosService.criaPagina(
                        usuario_id,
                        documento.documento_id,
                        nome,
                        tamanho,
                        formato,
                    );

                    if (!pagina) {
                        // TODO - remover página criada.
                    }
                }
            } else {
                // TODO - remover documnto criado.
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message:
                        '[ERRO] {criaDocumento} - Problemas para criar documento.',
                    metadata: {
                        documento_id: documento.documento_id,
                        nome: documento.nome,
                    },
                    status: true,
                });
            }

            /**
             * TODO - Rolback, para problemas no auth não funciona na controller :/
             */
            return res.status(HttpStatus.CREATED).json({
                message:
                    '[INFO] {criaDocumento} - Documento criado com sucesso.',
                metadata: documento,
                status: true,
            });
        } catch (erro) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message:
                    '[ERRO] {criaDocumento} - Problemas para criar documento.',
                erro: erro.message,
                status: false,
            });
        }
    }

    @HttpCode(200)
    @Delete(':documento_id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.USUARIO)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Remove documento do usuário' })
    @ApiOkResponse({
        description: 'Documento removido com sucesso',
        type: MessageStatus,
    })
    @ApiForbiddenResponse({
        description: '[ERRO] {DELETE - /documentos/{documento_id}} - Acesso negado',
        schema: {
            example: {
                message:
                    '[ERRO] {DELETE - /documentos/{documento_id}} - Usuário não tem permissão',
                status: false,
                erro: 'Usuário não tem permissão',
            },
            type: 'MessageStatus',
        },
    })
    @ApiInternalServerErrorResponse({
        description: '[ERRO] {DELETE - /documentos/{documento_id}} - Erro do servidor',
        schema: {
            example: {
                message: '[ERRO] {DELETE - /documentos/{documento_id}} - Ocorreu um erro',
                status: false,
                erro: 'Erro ao inicializar objeto',
            },
            type: 'MessageStatus',
        },
    })
    async removeDocumento(
        @Param() chaveDocumento: RequisicaoEncontraDocumentoDTO,
        @RequestUser() usuario_id: string,
        @Res() res: Response,
    ): Promise<Response> {
        try {
            const { documento_id } = chaveDocumento;
            const documento = await this.documentosService.encontraDocumento(
                usuario_id,
                documento_id,
            );

            if (!documento) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: '[ERRO] {removeDocumento} - Documento não foi encontrado.',
                    status: false,
                });
            }

            if (documento.audio_id) {
                const removeAudio = (await this.httpService
                    .delete(`http://localhost:5000/audios/${documento.nome}@${documento.documento_id}`)
                    .pipe(map(resp => resp.data))
                    .toPromise()) as {
                        message: string;
                        metadata: { formato: string; nome: string; tamanho: number };
                        status: boolean;
                    };

                if (removeAudio.status) {
                    const audio = await this.audiosService.removeAudio(
                        usuario_id,
                        documento.audio_id
                    );

                    if (!audio) {
                        /**
                         * TODO - Rolback
                         * acessar endpoint para remover arquivo do storage
                         */

                        return res.status(HttpStatus.BAD_REQUEST).json({
                            message: '[ERRO] {removeDocumento} - Problemas para remover áudio.',
                            status: false,
                        });
                    }

                    documento.audio_id = null;

                    await this.documentosService.removeAudioDoDocumento(documento);
                } else {
                    /**
                     * TODO - Rolback
                     * acessar endpoint para remover arquivo do storage
                     */

                    return res.status(HttpStatus.BAD_REQUEST).json({
                        message: '[ERRO] {removeDocumento} - Problemas para remover áudio.',
                        status: false,
                    });
                }
            }

            if (documento.paginas || documento.paginas.length > 0) {
                for (const pagina of documento.paginas) {
                    fs.unlink(`../../shared/images/${pagina.nome}`, (err) => {
                        if (err) {
                            // TODO - Rolback
                            throw err;
                        };
                        console.log(`A página "../../shared/images/${pagina.nome}" foi removida`);
                    });

                    await this.documentosService.removePagina(
                        pagina.pagina_id
                    );
                }
            }

            await this.documentosService.removeDocumento(
                documento_id
            );

            return res.status(HttpStatus.OK).json({
                message:
                    '[INFO] {removeDocumento} - Documento removido com sucesso.',
                status: true,
            });
        } catch (erro) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message:
                    '[ERRO] {removeDocumento} - Problemas para remover documento.',
                erro: erro.message,
                status: false,
            });
        }
    }
}
