import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
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
import { UsuariosService } from './shared/services/http/usuarios.service';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}

    /**
     * TODO
     * Adicionar paginação para listas;
     */
    @Get()
    // @UseGuards(
    //   AuthGuard,
    //   RolesGuard
    // @Roles(PapelUsuario.ADMINISTRADOR)
    // @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
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
    async listaUsuarios(@Res() res: Response): Promise<Response> {
        try {
            return res.status(HttpStatus.OK).json({
                message:
                    '[INFO] {listaUsuarios} - Usuários listados com sucesso',
                status: true,
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

    // encontraUsuario();

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
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

    // editaUsuario();

    // removeUsuario();

    /**
     * TODO
     * Métodos públicos para o usuário poder se auto-gerenciar
     */
    // perfil();
    // editarPerfil();
    // resetaSenha();
}
