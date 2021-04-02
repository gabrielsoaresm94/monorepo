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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { MessageStatus } from 'src/shared/erros.helper';
import { Role } from 'src/shared/guards/ role.enum';
import { Roles } from 'src/shared/guards/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { RequisicaoCriaUsuarioDTO } from './shared/dtos/req-post.dto';
import { RequisicaoEditaUsuarioDTO } from './shared/dtos/req-put.dto';
import { UsuariosService } from './shared/services/http/usuarios.service';

@ApiTags('Usuários')
@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}

    /**
     * TODO
     * Adicionar paginação para listas;
     */
    @HttpCode(200)
    @Get()
    // @UseGuards(
    //   AuthGuard,
    //   RolesGuard
    // )
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
        @Query() dadosReqListaaUsuario,
        @Res() res: Response
    ): Promise<Response> {
        try {
            const {usuario, email} = dadosReqListaaUsuario;

            const usuarios = await this.usuariosService.listaUsuarios(
                usuario,
                email
            );

            return res.status(HttpStatus.OK).json({
                message:
                    '[INFO] {listaUsuarios} - Usuários listados com sucesso',
                status: true,
                metadata: usuarios
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
    @Get(':usuario_id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Encontra usuário' })
    @ApiOkResponse({
        description: 'Consulta obtida com sucesso',
        type: MessageStatus,
    })
    @ApiForbiddenResponse({
        description: '[ERRO] {GET - /usuarios/:usuario_id} - Acesso negado',
        schema: {
            example: {
                message: '[ERRO] {GET - /usuarios/:usuario_id} - Usuário não tem permissão',
                status: false,
                erro: 'Usuário não tem permissão',
            },
            type: 'MessageStatus',
        },
    })
    @ApiInternalServerErrorResponse({
        description: '[ERRO] {GET - /usuarios/:usuario_id} - Erro do servidor',
        schema: {
            example: {
                message: '[ERRO] {GET - /usuarios/:usuario_id} - Ocorreu um erro',
                status: false,
                erro: 'Erro ao inicializar objeto',
            },
            type: 'MessageStatus',
        },
    })
    async encontraUsuario(
        @Param() chaveUsuario: string,
        @Res() res: Response
    ) {
        try {
            const consultaUsuario = await this.usuariosService.encontraUsuario(chaveUsuario);

            return res.status(HttpStatus.OK).json({
                message: '[INFO] {encontraUsuario} - Usuário encontrado com sucesso.',
                metedata: consultaUsuario,
                status: true,
            });
        } catch (erro) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: '[ERRO] {encontraUsuario} - Problemas para encontrar usuário.',
                erro: erro.message,
                status: false,
            });
        }
    }

    @HttpCode(201)
    @Post()
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
                message: '[ERRO] {POST - /usuarios} - Usuário não tem permissão',
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
        @Body() dadosReqUsuario: RequisicaoCriaUsuarioDTO,
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
    @Put(':usuario_id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Edita usuário' })
    @ApiOkResponse({
        description: 'Edição realizada com sucesso',
        type: MessageStatus,
    })
    @ApiForbiddenResponse({
        description: '[ERRO] {PUT - /usuarios/:usuario_id} - Acesso negado',
        schema: {
            example: {
                message: '[ERRO] {PUT - /usuarios/:usuario_id} - Usuário não tem permissão',
                status: false,
                erro: 'Usuário não tem permissão',
            },
            type: 'MessageStatus',
        },
    })
    @ApiInternalServerErrorResponse({
        description: '[ERRO] {PUT - /usuarios/:usuario_id} - Erro do servidor',
        schema: {
            example: {
                message: '[ERRO] {PUT - /usuarios/:usuario_id} - Ocorreu um erro',
                status: false,
                erro: 'Erro ao inicializar objeto',
            },
            type: 'MessageStatus',
        },
    })
    async editaUsuario(
        @Body() dadosReqUsuario: Partial<RequisicaoEditaUsuarioDTO>,
        @Param() chaveUsuario: string,
        @Res() res: Response
    ) {
        try {
            let {nome, email, papel} = dadosReqUsuario;

            const editaUsuario = await this.usuariosService.editaUsuario(
                chaveUsuario,
                nome,
                email,
                papel
            );

            return res.status(HttpStatus.OK).json({
                message: '[INFO] {editaUsuario} - Usuário editado com sucesso.',
                metedata: editaUsuario,
                status: true,
            });
        } catch (erro) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: '[ERRO] {editaUsuario} - Problemas para editar usuário.',
                erro: erro.message,
                status: false,
            });
        }
    }

    @HttpCode(200)
    @Delete(':usuario_id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Remove usuário' })
    @ApiOkResponse({
        description: 'Remoção feita com sucesso',
        type: MessageStatus,
    })
    @ApiForbiddenResponse({
        description: '[ERRO] {DELETE - /usuarios/:usuario_id} - Acesso negado',
        schema: {
            example: {
                message: '[ERRO] {DELETE - /usuarios/:usuario_id} - Usuário não tem permissão',
                status: false,
                erro: 'Usuário não tem permissão',
            },
            type: 'MessageStatus',
        },
    })
    @ApiInternalServerErrorResponse({
        description: '[ERRO] {DELETE - /usuarios/:usuario_id} - Erro do servidor',
        schema: {
            example: {
                message: '[ERRO] {DELETE - /usuarios/:usuario_id} - Ocorreu um erro',
                status: false,
                erro: 'Erro ao inicializar objeto',
            },
            type: 'MessageStatus',
        },
    })
    async removeUsuario(
        @Param() chaveUsuario: string,
        @Res() res: Response
    ) {
        try {
            // const removeUsuario = await this.usuariosService.removeUsuario(chaveUsuario);

            return res.status(HttpStatus.OK).json({
                message: '[INFO] {removeUsuario} - Usuário removido com sucesso.',
                // metedata: removeUsuario,
                status: true,
            });
        } catch (erro) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: '[ERRO] {removeUsuario} - Problemas para remover usuário.',
                erro: erro.message,
                status: false,
            });
        }
    }

    /**
     * TODO
     * Métodos públicos para o usuário poder se auto-gerenciar
     */
    // perfil();
    // editarPerfil();
    // resetaSenha();
}
