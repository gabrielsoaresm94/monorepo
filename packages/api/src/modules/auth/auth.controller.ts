import {
    Controller,
    UseGuards,
    HttpStatus,
    Response,
    Post,
    Body,
    HttpException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsuariosService } from '../usuarios/shared/services/http/usuarios.service';
import { RequisicaoLoginDTO } from './shared/dtos/login.dto';
import { RequisicaoRegistroDTO } from './shared/dtos/req-registro.dto';
import { AuthService } from './shared/services/http/auth.service';

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usuariosService: UsuariosService,
    ) {}

    @Post('cadastro')
    public async cadastro(
        @Body() dadosReqCadastroUsuario: RequisicaoRegistroDTO,
        @Response() res
    ) {
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

    @Post('login')
    public async login(@Response() res, @Body() login: RequisicaoLoginDTO) {
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
                erro: erro.error,
                status: false,
            });
        }
    }
}
