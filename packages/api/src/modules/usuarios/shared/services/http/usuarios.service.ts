import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { geraHash } from 'src/shared/functions/utils';
import { Role } from 'src/shared/guards/ role.enum';
import Usuario from '../../typeorm/entities/usuario.entity';
import { UsuariosRepository } from '../../typeorm/repositories/usuarios.repository';

@Injectable()
export class UsuariosService {
    constructor(private usuariosRepository: UsuariosRepository) {}

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

    public async listaUsuarios(
        id: string,
        email: string,
    ): Promise<Array<Usuario>> {
        let usuarios: Array<Usuario> = [];
        let usuario: Usuario;

        if (id || email) {
            if (id) {
                usuario = await this.usuariosRepository.encontraPorId(id);
                if (usuario) {
                    usuarios.push(usuario);
                }
            }

            if (email) {
                usuario = await this.usuariosRepository.encontraPorEmail(email);
                if (usuario) {
                    usuarios.push(usuario);
                }
            }
        } else {
            usuarios = await this.usuariosRepository.listaUsuarios();
        }

        const usuariosSemDuplicatas = _.uniqBy(usuarios, 'usuario_id');

        return usuariosSemDuplicatas;
    }

    public async editaUsuario(
        chaveUsuario: string,
        nome: string,
        email: string,
        papel: Role,
    ): Promise<Usuario> {
        const consultaUsuario = await this.usuariosRepository.encontraPorId(
            chaveUsuario,
        );

        if (!consultaUsuario) {
            console.log('Usuário não encontrado!');
            throw new Error('Usuário não encontrado!');
        }

        if (nome) {
            consultaUsuario.nome = nome;
        }

        if (email) {
            const verificaEmail = await this.usuariosRepository.encontraPorEmail(
                email,
            );

            if (verificaEmail) {
                console.log('Email já está sendo usado!');
                throw new Error('Email já está sendo usado!');
            }

            consultaUsuario.email = email;
        }

        if (papel) {
            consultaUsuario.papel = papel;
        }

        const editaUsuario = await this.usuariosRepository.salva(
            consultaUsuario,
        );

        return editaUsuario;
    }

    // public async removeUsuario(usuario_id: string): Promise<Usuario> {
    //     const usuario = await this.usuariosRepository.encontraPorId(usuario_id);

    //     if (!usuario) {
    //         throw new Error('Usuário não encontrado!');
    //     }
    //     return usuario;
    // }
}
