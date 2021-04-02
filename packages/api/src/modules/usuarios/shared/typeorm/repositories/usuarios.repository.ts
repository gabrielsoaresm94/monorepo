import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository, Not, EntityRepository } from 'typeorm';
import { RequisicaoCriaUsuarioDTO } from '../../dtos/req-post.dto';
import Usuario from '../entities/usuario.entity';

@EntityRepository(Usuario)
export class UsuariosRepository {
    // implements IUsersRepository

    constructor(
        @InjectRepository(Usuario)
        private ormRepository: Repository<Usuario>,
    ) {}

    public async cria(
        dadosReqUsuario: RequisicaoCriaUsuarioDTO,
    ): Promise<Usuario> {
        const usuario = this.ormRepository.create(dadosReqUsuario);

        await this.ormRepository.save(usuario);

        return usuario;
    }

    public async salva(usuario: Usuario): Promise<Usuario> {
        return await this.ormRepository.save(usuario);
    }

    public async encontraPorEmail(email: string): Promise<Usuario | undefined> {
        const usuario = await this.ormRepository.findOne({
            where: { email },
        });

        return usuario;
    }

    public async encontraPorId(
        usuario_id: string,
    ): Promise<Usuario | undefined> {
        const usuario = await this.ormRepository.findOne(usuario_id);
        return usuario;
    }

    public async listaUsuarios(): Promise<Array<Usuario>> {
        const usuarios = await this.ormRepository.find();
        return usuarios;
    }
}
