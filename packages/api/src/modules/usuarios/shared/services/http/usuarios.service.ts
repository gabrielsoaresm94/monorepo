import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { geraHash } from 'src/shared/functions/utils';
import { Role } from 'src/shared/guards/ role.enum';
import Usuario from '../../typeorm/entities/usuario.entity';
import { UsuariosRepository } from '../../typeorm/repositories/usuarios.repository';

@Injectable()
export class UsuariosService {
    constructor(
        private usuariosRepository: UsuariosRepository,
    ) {}

    // private readonly logger = new Logger();

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
        const verificaEmail = await this.usuariosRepository.encontraPorEmail(
            email,
        );

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

    public async encontraUsuario(usuario_id: string): Promise<Usuario> {
        const usuario = await this.usuariosRepository.encontraPorId(usuario_id);

        if (!usuario) {
            throw new Error('Usuário não encontrado!');
        }

        return usuario;
    }

    public async encontraUsuarioPorEmail(email: string): Promise<Usuario> {
        const usuario = await this.usuariosRepository.encontraPorEmail(email);

        if (!usuario) {
            throw new Error('Usuário não encontrado!');
        }

        return usuario;
    }

    /**
     * TODO
     */
    public async listaUsuarios({
        id,
        email,
    }: {
        id?: string;
        email?: string;
    }): Promise<Array<Usuario>> {
        const usuarios = [];
        let usuario: Usuario;

        if (id && email) {
            usuario = await this.usuariosRepository.encontraPorId(id);
            if (usuario) {
                usuarios.push(usuario);
            }
        } else if (id || email) {
            if (id) {
                usuario = await this.usuariosRepository.encontraPorId(id);
                if (usuario) {
                    usuarios.push(usuario);
                }
            } else if (email) {
                usuario = await this.usuariosRepository.encontraPorEmail(email);
                if (usuario) {
                    usuarios.push(usuario);
                }
            }
        } else {
            // TODO - consumir repository para listar todos os usuários;
            // TODO - adicinar paginação;
        }
        return usuarios;
    }
}
