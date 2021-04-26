import {
    Controller,
    HttpStatus,
    Res,
    Post,
    Body,
    HttpException,
    HttpCode,
} from '@nestjs/common';
import {
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { MessageStatus } from 'src/shared/erros.helper';
import { UsuariosService } from '../usuarios/shared/services/http/usuarios.service';
import { RequisicaoLoginDTO } from './shared/dtos/login.dto';
import { RequisicaoRegistroDTO } from './shared/dtos/req-registro.dto';
import { AuthService } from './shared/services/http/auth.service';

@ApiTags('Autenticação')
@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usuariosService: UsuariosService,
    ) {}

    @HttpCode(201)
    @Post('cadastro')
    @ApiOperation({ summary: 'Cadastra usuário' })
    @ApiOkResponse({
        description: 'Cadastro realizado com sucesso',
        type: MessageStatus,
    })
    @ApiInternalServerErrorResponse({
        description: '[ERRO] {POST - /cadastro} - Erro do servidor',
        schema: {
            example: {
                message: '[ERRO] {POST - /cadastro} - Ocorreu um erro',
                status: false,
                erro: 'Erro ao inicializar objeto',
            },
            type: 'MessageStatus',
        },
    })
    public async cadastro(
        @Body() dadosReqCadastroUsuario: RequisicaoRegistroDTO,
        @Res() res: Response,
    ): Promise<Response> {
        try {
            const dadosUsuario = await this.authService.cadastro(
                dadosReqCadastroUsuario,
            );

            return res.status(HttpStatus.CREATED).json({
                message: '[INFO] {cadastro} - Usuário cadastrado com sucesso.',
                metedata: dadosUsuario,
                status: true,
            });
        } catch (erro) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message:
                    '[ERRO] {cadastro} - Problemas para cadastrar usuário.',
                erro: erro.message,
                status: false,
            });
        }
    }

    @HttpCode(200)
    @Post('login')
    @ApiOperation({ summary: 'Inicia sessão  usuário' })
    @ApiOkResponse({
        description: 'Sessão iniciada com sucesso',
        type: MessageStatus,
    })
    @ApiForbiddenResponse({
        description: '[ERRO] {POST - /login} - Acesso negado',
        schema: {
            example: {
                message: '[ERRO] {POST - /login} - Usuário não tem permissão',
                status: false,
                erro: 'Usuário não tem permissão',
            },
            type: 'MessageStatus',
        },
    })
    @ApiInternalServerErrorResponse({
        description: '[ERRO] {POST - /login} - Erro do servidor',
        schema: {
            example: {
                message: '[ERRO] {POST - /login} - Ocorreu um erro',
                status: false,
                erro: 'Erro ao inicializar objeto',
            },
            type: 'MessageStatus',
        },
    })
    public async login(
        @Res() res: Response,
        @Body() login: RequisicaoLoginDTO,
    ): Promise<Response> {
        try {
            const { email, senha } = login;

            const usuario = await this.authService.validaUsuario(email, senha);

            if (!usuario) {
                throw new HttpException(
                    {
                        message: 'Erro ao efetuar login.',
                        status: false,
                        error:
                            'Erro ao efetuar login, por favor verifica email ou senha.',
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }

            const token = this.authService.criaToken(usuario);

            return res.status(HttpStatus.OK).json({
                message: '[INFO] {login} - Login realizado com sucesso.',
                metedata: token,
                status: true,
            });
        } catch (erro) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                message: '[ERRO] {login} - Problemas para logar na aplicação.',
                erro: erro.message,
                status: false,
            });
        }
    }
}
