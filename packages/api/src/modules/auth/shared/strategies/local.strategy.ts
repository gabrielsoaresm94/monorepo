import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
    Injectable,
    Logger,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../services/http/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'senha',
        });
    }

    private readonly logger = new Logger(AuthService.name);

    async validate(email: string, senha: string): Promise<any> {
        const user = await this.authService.validaUsuario(email, senha);
        this.logger.log(user);
        if (!user) {
            console.log(
                'Erro ao efetuar login, por favor verifica email ou senha.',
            );
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
        return user;
    }
}
