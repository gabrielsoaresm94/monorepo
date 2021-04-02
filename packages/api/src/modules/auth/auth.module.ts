import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './shared/strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './shared/strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { UsuariosService } from '../usuarios/shared/services/http/usuarios.service';
import { AuthService } from './shared/services/http/auth.service';

@Module({
    imports: [
        UsuariosModule,
        PassportModule,
        JwtModule.register({
            secret: (process.env.TOKEN_SEGREDO).toString(),
            signOptions: { expiresIn: Number(process.env.TOKEN_TEMPO_EXP) },
        }),
    ],
    controllers: [AuthController],
    providers: [UsuariosService, AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
