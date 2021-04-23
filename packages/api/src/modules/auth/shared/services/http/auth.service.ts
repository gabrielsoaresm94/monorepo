import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { debug } from 'console';
import { comparaHash } from 'src/shared/functions/utils';
import { Role } from 'src/shared/guards/ role.enum';
import { UsuariosService } from 'src/modules/usuarios/shared/services/http/usuarios.service';
import Usuario from 'src/modules/usuarios/shared/typeorm/entities/usuario.entity';
import { RequisicaoRegistroDTO } from '../../dtos/req-registro.dto';

@Injectable()
export class AuthService {
    constructor(private readonly usuariosService: UsuariosService) {}

    private readonly logger = new Logger(AuthService.name);

    async cadastro(usuario: RequisicaoRegistroDTO): Promise<Usuario> {
        const dadosUsuario = await this.usuariosService.criaUsuario(
            usuario.nome,
            usuario.email,
            usuario.senha,
            Role.USUARIO,
        );

        return dadosUsuario;
    }

    criaToken(usuario: {
        usuario_id: string;
        nome: string;
        email: string;
        papel: string;
    }) {
        // console.log(process.env.TOKEN_TEMPO_EXP);
        // console.log(process.env.TOKEN_SEGREDO);

        const expiresIn = Number(process.env.TOKEN_TEMPO_EXP);
        const accessToken = jwt.sign(
            {
                id: usuario.usuario_id,
                email: usuario.email,
                nome: usuario.nome,
            },
            (process.env.TOKEN_SEGREDO).toString(),
            { expiresIn },
        );
        return {
            expiresIn,
            accessToken,
        };
    }

    async validaUsuarioToken(payload: {
        id: string;
        email: string;
        nome: string;
    }): Promise<Usuario> {
        const usuario = await this.usuariosService.encontraUsuario(payload.id);
        return usuario;
    }

    async validaUsuario(
        email: string,
        senha: string,
    ): Promise<{
        usuario_id: string;
        nome: string;
        email: string;
        papel: string;
    }> {
        const usuario = await this.usuariosService.encontraUsuarioPorEmail(email);

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

        const verificaHasah = await comparaHash(senha, usuario.senha);

        if (usuario && verificaHasah) {
            const usuarioTratado = {
                usuario_id: usuario.usuario_id,
                nome: usuario.nome,
                email: usuario.email,
                papel: usuario.papel,
            };
            return usuarioTratado;
        }
        return null;
    }
}
