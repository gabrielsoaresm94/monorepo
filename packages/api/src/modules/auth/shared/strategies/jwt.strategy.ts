import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../services/http/auth.service';
import Usuario from 'src/modules/usuarios/shared/typeorm/entities/usuario.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.TOKEN_SEGREDO,
        });
    }

    async validate(
        payload: {
            id: string;
            email: string;
            nome: string;
            iat: number;
            exp: number;
        },
        done: (error: Error, usuario: Usuario) => void,
    ): Promise<void> {
        const usuario = await this.authService.validaUsuarioToken(payload);
        if (!usuario) {
            console.log('Sem autorização, para acessar rota efetue o login.');
            throw new HttpException(
                {
                    message: 'Sem autorização.',
                    status: false,
                    error: 'Sem autorização, para acessar rota efetue o login.',
                },
                HttpStatus.UNAUTHORIZED,
            );
        }
        done(null, usuario);
    }
}
