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
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiBearerAuth,
    ApiBody,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { RequestUser } from 'src/shared/decorators/req-user.decorator';
import { Role } from 'src/shared/guards/ role.enum';
import { Roles } from 'src/shared/guards/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { DocumentosService } from '../documentos/shared/services/http/documentos.service';
import { RequisicaoEncontraUsuarioDTO, RequisicaoListaUsuariosDTO } from './shared/dtos/req-get.dto';
import { RequisicaoCriaUsuarioDTO } from './shared/dtos/req-post.dto';
import { RequisicaoEditaPerfilDTO } from './shared/dtos/req-put-perfil.dto';
import { RequisicaoEditaUsuarioDTO } from './shared/dtos/req-put.dto';
import { UsuariosService } from './shared/services/http/usuarios.service';
import { AudiosService } from '../audios/shared/services/http/audios.service';
import { map } from 'rxjs/operators';

@ApiTags('Usuários')
@Controller()
export class UsuariosController {
    constructor(
        private readonly usuariosService: UsuariosService,
        private readonly documentosService: DocumentosService,
        private readonly audiosService: AudiosService,
        private readonly httpService: HttpService,
    ) {}

    /**
     * TODO
     * Adicionar paginação para listas;
     */
    @HttpCode(200)
    @Get('usuarios')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Listagem de usuários' })
    @ApiOkResponse({
        description: 'Consulta obtida com sucesso',
    })
    @ApiForbiddenResponse({
        description: '[ERRO] {GET - /usuarios} - Acesso negado',
        schema: {
            example: {
                message: '[ERRO] {GET - /usuarios} - Usuário não tem permissão',
                status: false,
                erro: 'Usuário não tem permissão',
            },
        },
    })
    @ApiInternalServerErrorResponse({
        description: '[ERRO] {GET - /usuarios} - Erro do servidor',
        schema: {
            example: {
                message: '[ERRO] {GET - /usuarios} - Ocorreu um erro',
                status: false,
                erro: 'Erro ao inicializar objeto',
            },
        },
    })
    async listaUsuarios(
        @Query() dadosReqListaUsuario: RequisicaoListaUsuariosDTO,
        @Res() res: Response,
    ): Promise<Response> {
        try {
            const { usuario_id, email } = dadosReqListaUsuario;

            const usuarios = await this.usuariosService.listaUsuarios(
                usuario_id,
                email,
            );

            return res.status(HttpStatus.OK).json({
                message:
                    '[INFO] {listaUsuarios} - Usuários listados com sucesso',
                status: true,
                metadata: usuarios,
            });
        } catch (erro) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message:
                    '[ERRO] {listaUsuarios} - Problemas para listar usuários.',
                erro: erro.message,
                status: false,
            });
        }
    }

    @HttpCode(200)
    @Get('usuarios/:usuario_id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Encontra usuário' })
    @ApiOkResponse({
        description: 'Consulta obtida com sucesso',
    })
    @ApiForbiddenResponse({
        description: '[ERRO] {GET - /usuarios/{usuario_id}} - Acesso negado',
        schema: {
            example: {
                message:
                    '[ERRO] {GET - /usuarios/{usuario_id}} - Usuário não tem permissão',
                status: false,
                erro: 'Usuário não tem permissão',
            },
        },
    })
    @ApiInternalServerErrorResponse({
        description: '[ERRO] {GET - /usuarios/{usuario_id}} - Erro do servidor',
        schema: {
            example: {
                message:
                    '[ERRO] {GET - /usuarios/{usuario_id}} - Ocorreu um erro',
                status: false,
                erro: 'Erro ao inicializar objeto',
            },
        },
    })
    async encontraUsuario(
        @Param() chaveUsuario: RequisicaoEncontraUsuarioDTO,
        @Res() res: Response,
    ): Promise<Response> {
        try {
            const { usuario_id } = chaveUsuario;
            const consultaUsuario = await this.usuariosService.encontraUsuario(
                usuario_id,
            );

            return res.status(HttpStatus.OK).json({
                message:
                    '[INFO] {encontraUsuario} - Usuário encontrado com sucesso.',
                metedata: consultaUsuario,
                status: true,
            });
        } catch (erro) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message:
                    '[ERRO] {encontraUsuario} - Problemas para encontrar usuário.',
                erro: erro.message,
                status: false,
            });
        }
    }

    @HttpCode(201)
    @Post('usuarios')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Criação de usuário' })
    @ApiOkResponse({
        description: 'Criação realizada com sucesso',
    })
    @ApiForbiddenResponse({
        description: '[ERRO] {POST - /usuarios} - Acesso negado',
        schema: {
            example: {
                message:
                    '[ERRO] {POST - /usuarios} - Usuário não tem permissão',
                status: false,
                erro: 'Usuário não tem permissão',
            },
        },
    })
    @ApiInternalServerErrorResponse({
        description: '[ERRO] {POST - /usuarios} - Erro do servidor',
        schema: {
            example: {
                message: '[ERRO] {POST - /usuarios} - Ocorreu um erro',
                status: false,
                erro: 'Erro ao inicializar objeto',
            },
        },
    })
    async criaUsuario(
        @Body(ValidationPipe) dadosReqUsuario: RequisicaoCriaUsuarioDTO,
        @Res() res: Response,
    ): Promise<Response> {
        try {
            const { nome, email, senha, papel } = dadosReqUsuario;

            const dadosUsuario = await this.usuariosService.criaUsuario(
                nome,
                email,
                senha,
                papel,
            );

            return res.status(HttpStatus.CREATED).json({
                message: '[INFO] {criaUsuario} - Usuário criado com sucesso.',
                metedata: dadosUsuario,
                status: true,
            });
        } catch (erro) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: '[ERRO] {criaUsuario} - Problemas para criar usuário.',
                erro: erro.message,
                status: false,
            });
        }
    }

    @HttpCode(200)
    @Put('usuarios/:usuario_id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Edita usuário' })
    @ApiOkResponse({
        description: 'Edição realizada com sucesso',
    })
    @ApiForbiddenResponse({
        description: '[ERRO] {PUT - /usuarios/{usuario_id}} - Acesso negado',
        schema: {
            example: {
                message:
                    '[ERRO] {PUT - /usuarios/{usuario_id}} - Usuário não tem permissão',
                status: false,
                erro: 'Usuário não tem permissão',
            },
        },
    })
    @ApiInternalServerErrorResponse({
        description: '[ERRO] {PUT - /usuarios/{usuario_id}} - Erro do servidor',
        schema: {
            example: {
                message:
                    '[ERRO] {PUT - /usuarios/{usuario_id}} - Ocorreu um erro',
                status: false,
                erro: 'Erro ao inicializar objeto',
            },
        },
    })
    async editaUsuario(
        @Body() dadosReqUsuario: RequisicaoEditaUsuarioDTO,
        @Param() chaveUsuario: RequisicaoEncontraUsuarioDTO,
        @Res() res: Response,
    ): Promise<Response> {
        try {
            const { usuario_id } = chaveUsuario;
            const { nome, email, papel } = dadosReqUsuario;

            const usuarioEditado = await this.usuariosService.editaUsuario(
                usuario_id,
                nome,
                email,
                papel,
            );

            return res.status(HttpStatus.OK).json({
                message: '[INFO] {editaUsuario} - Usuário editado com sucesso.',
                metedata: usuarioEditado,
                status: true,
            });
        } catch (erro) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message:
                    '[ERRO] {editaUsuario} - Problemas para editar usuário.',
                erro: erro.message,
                status: false,
            });
        }
    }

    @HttpCode(200)
    @Delete('usuarios/:usuario_id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Remove usuário' })
    @ApiOkResponse({
        description: 'Remoção feita com sucesso',
    })
    @ApiForbiddenResponse({
        description: '[ERRO] {DELETE - /usuarios/{usuario_id}} - Acesso negado',
        schema: {
            example: {
                message:
                    '[ERRO] {DELETE - /usuarios/{usuario_id}} - Usuário não tem permissão',
                status: false,
                erro: 'Usuário não tem permissão',
            },
        },
    })
    @ApiInternalServerErrorResponse({
        description:
            '[ERRO] {DELETE - /usuarios/{usuario_id}} - Erro do servidor',
        schema: {
            example: {
                message:
                    '[ERRO] {DELETE - /usuarios/{usuario_id}} - Ocorreu um erro',
                status: false,
                erro: 'Erro ao inicializar objeto',
            },
        },
    })
    async removeUsuario(
        @Param() chaveUsuario: RequisicaoEncontraUsuarioDTO,
        @Res() res: Response,
    ): Promise<Response> {
        try {
            const { usuario_id } = chaveUsuario;

            const usuario = await this.usuariosService.encontraUsuario(
                usuario_id
            );

            if (!usuario) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    message:
                        '[ERRO] {removeUsuario} - Usuário não encontrado.',
                    status: true,
                });
            }

            const documentos = await this.documentosService.listaDocumentos(
                usuario_id,
                '',
            );

            if (documentos) {
                for (const documento of documentos) {
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
                        documento.documento_id
                    );
                }
            }

            await this.usuariosService.removeUsuario(usuario_id);

            return res.status(HttpStatus.OK).json({
                message:
                    '[INFO] {removeUsuario} - Usuário removido com sucesso.',
                status: true,
            });
        } catch (erro) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message:
                    '[ERRO] {removeUsuario} - Problemas para remover usuário.',
                erro: erro.message,
                status: false,
            });
        }
    }

    /**
     * Métodos públicos para o usuário poder se auto-gerenciar
     * TODO
     * resetaSenha();
     */
    @HttpCode(200)
    @Get('perfil')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Encontra perfil do usuário' })
    @ApiOkResponse({
        description: 'Perfil encontrado com sucesso',
    })
    @ApiForbiddenResponse({
        description: '[ERRO] {GET - /perfil} - Acesso negado',
        schema: {
            example: {
                message:
                    '[ERRO] {GET - /perfil} - Usuário não tem permissão',
                status: false,
                erro: 'Usuário não tem permissão',
            },
        },
    })
    @ApiInternalServerErrorResponse({
        description:
            '[ERRO] {GET - /perfil} - Erro do servidor',
        schema: {
            example: {
                message:
                    '[ERRO] {GET - /perfil} - Ocorreu um erro',
                status: false,
                erro: 'Erro ao inicializar objeto',
            },
        },
    })
    async perfil(
        @RequestUser() usuario_id: string,
        @Res() res: Response,
    ): Promise<Response> {
        try {
            const usuario = await this.usuariosService.encontraUsuario(
                usuario_id,
            );

            return res.status(HttpStatus.OK).json({
                message: '[INFO] {perfil} - Perfil encontrado com sucesso.',
                metadata: usuario,
                status: true,
            });
        } catch (erro) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message:
                    '[ERRO] {perfil} - Problemas para encontrar perfil do usuário.',
                erro: erro.message,
                status: false,
            });
        }
    }

    @HttpCode(200)
    @Put('perfil')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Edita perfil do usuário' })
    @ApiOkResponse({
        description: 'Perfil editado com sucesso',
    })
    @ApiForbiddenResponse({
        description: '[ERRO] {PUT - /perfil} - Acesso negado',
        schema: {
            example: {
                message:
                    '[ERRO] {PUT - /perfil} - Usuário não tem permissão',
                status: false,
                erro: 'Usuário não tem permissão',
            },
        },
    })
    @ApiInternalServerErrorResponse({
        description:
            '[ERRO] {PUT - /perfil} - Erro do servidor',
        schema: {
            example: {
                message:
                    '[ERRO] {PUT - /perfil} - Ocorreu um erro',
                status: false,
                erro: 'Erro ao inicializar objeto',
            },
        },
    })
    @ApiBody({ type: RequisicaoEditaPerfilDTO })
    async editarPerfil(
        @Body() dadosReqUsuario: RequisicaoEditaPerfilDTO,
        @RequestUser() usuario_id: string,
        @Res() res: Response,
    ): Promise<Response> {
        try {
            const { nome, email } = dadosReqUsuario;

            const usuario = await this.usuariosService.encontraUsuario(
                usuario_id,
            );

            const usuarioEditado = await this.usuariosService.editaUsuario(
                usuario_id,
                nome,
                email,
                usuario.papel as Role
            );

            return res.status(HttpStatus.OK).json({
                message: '[INFO] {editarPerfil} - Perfil editado com sucesso.',
                metadata: usuarioEditado,
                status: true,
            });
        } catch (erro) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message:
                    '[ERRO] {editarPerfil} - Problemas para editar perfil do usuário.',
                erro: erro.message,
                status: false,
            });
        }
    }
}
