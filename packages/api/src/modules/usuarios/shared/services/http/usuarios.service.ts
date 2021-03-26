import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { geraHash } from 'src/shared/functions/utils';
import { Role } from 'src/shared/guards/ role.enum';
import Usuario from '../../typeorm/entities/usuario.entity';
import UsuariosRepository from '../../typeorm/repositories/usuarios.repository';

@Injectable()
export class UsuariosService {
    constructor(
        // @InjectRepository(Usuario)
        private usuariosRepository: UsuariosRepository
    ) {}

    getHello(): string {
        return 'Hello World!';
    }

    public async criaUsuario(
        nome: string,
        email: string,
        senha: string,
        papel: Role.ADMIN | Role.USUARIO,
    ): Promise<Usuario> {
        /**
         * TODO:
         * Adicionar rollback para caso dê algum problema na criação,
         * procurar alguma maneira usando typeorm;
         */

        const verificaEmail = await this.usuariosRepository.encontraPorEmail(email);

        if (verificaEmail) {
            console.log('Email já está sendo usado!');
            throw new Error('Email já está sendo usado!');
        }

        const hashSenha = await geraHash(senha);

        const usuario = await this.usuariosRepository.cria({
            nome,
            email,
            senha: hashSenha,
            papel,
        });

        return usuario;
    }
}
