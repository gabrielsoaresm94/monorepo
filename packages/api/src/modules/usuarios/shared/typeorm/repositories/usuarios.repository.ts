import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository, Not, EntityRepository } from 'typeorm';
import { RequisicaoCriaUsuarioDTO } from '../../dtos/req-post.dto';
import Usuario from '../entities/usuario.entity';

@EntityRepository(Usuario)
class UsuariosRepository {
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

    public async encontraPorEmail(
        email: string,
    ): Promise<Usuario | undefined> {
        const usuario = await this.ormRepository.findOne({
            where: { email },
        });

        return usuario;
    }
}

export default UsuariosRepository;
