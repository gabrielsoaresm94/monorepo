import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
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
import { MessageStatus } from 'src/shared/erros.helper';
import { Role } from 'src/shared/guards/ role.enum';
import { Roles } from 'src/shared/guards/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { RequisicaoEncontraUsuarioDTO, RequisicaoListaUsuariosDTO } from './shared/dtos/req-get.dto';
import { RequisicaoCriaUsuarioDTO } from './shared/dtos/req-post.dto';
import { RequisicaoEditaPerfilDTO } from './shared/dtos/req-put-perfil.dto';
import { RequisicaoEditaUsuarioDTO } from './shared/dtos/req-put.dto';
import { UsuariosService } from './shared/services/http/usuarios.service';

@ApiTags('Usuários')
@Controller()
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}

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
        type: MessageStatus,
    })
    @ApiForbiddenResponse({
        description: '[ERRO] {GET - /usuarios} - Acesso negado',
        schema: {
            example: {
                message: '[ERRO] {GET - /usuarios} - Usuário não tem permissão',
                status: false,
                erro: 'Usuário não tem permissão',
            },
            type: 'MessageStatus',
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
            type: 'MessageStatus',
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
        type: MessageStatus,
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
            type: 'MessageStatus',
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
            type: 'MessageStatus',
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
        type: MessageStatus,
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
            type: 'MessageStatus',
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
            type: 'MessageStatus',
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
        type: MessageStatus,
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
            type: 'MessageStatus',
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
            type: 'MessageStatus',
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
        type: MessageStatus,
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
            type: 'MessageStatus',
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
            type: 'MessageStatus',
        },
    })
    async removeUsuario(
        @Param() chaveUsuario: RequisicaoEncontraUsuarioDTO,
        @Res() res: Response,
    ): Promise<Response> {
        try {
            // const { usuario_id } = chaveUsuario;
            // const removeUsuario = await this.usuariosService.removeUsuario(chaveUsuario);

            return res.status(HttpStatus.OK).json({
                message:
                    '[INFO] {removeUsuario} - Usuário removido com sucesso.',
                // metedata: removeUsuario,
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
        type: MessageStatus,
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
            type: 'MessageStatus',
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
            type: 'MessageStatus',
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
        type: MessageStatus,
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
            type: 'MessageStatus',
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
            type: 'MessageStatus',
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
