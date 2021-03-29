import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { use } from 'passport';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/http/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'Codebrains',
        });
    }

    async validate(payload: any, done: Function) {
        const usuario = await this.authService.validaUsuarioToken(payload);
        if (!usuario) {
            console.log(
                'Sem aautorização, para acessar rota efetue o login.',
            );
            throw new HttpException(
                {
                    message: 'Sem aautorização.',
                    status: false,
                    error:
                        'Sem aautorização, para acessar rota efetue o login.',
                },
                HttpStatus.UNAUTHORIZED,
            );
        }
        done(null, usuario);
    }
}
