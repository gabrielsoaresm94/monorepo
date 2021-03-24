import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { geraHash } from 'src/shared/functions/utils';
import Usuario from '../../typeorm/entities/usuario.entity';
import UsuariosRepository from '../../typeorm/repositories/usuarios.repository';

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuario)
        private usuariosRepository: UsuariosRepository
    ) {}

    getHello(): string {
        return 'Hello World!';
    }

    public async criaUsuario(
        nome: string,
        email: string,
        senha: string,
        papel: string
    ): Promise<Usuario> {
        /**
         * TODO:
         * Verifica role de quem chamou o método, caso não exista, cria um usuário;
         * Apenas admins podem criar admins;
         * Verifica se o usuário já existe;
         */

        const hashSenha = await geraHash(senha);

        const usuario = this.usuariosRepository.cria({
            nome,
            email,
            senha: hashSenha,
            papel
        });

        return usuario;
    }
}
