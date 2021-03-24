import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository, Not } from 'typeorm';
import { RequisicaoCriaUsuarioDTO } from '../../dtos/req-post.dto';
import Usuario from '../entities/usuario.entity';

class UsuariosRepository { // implements IUsersRepository
    // private ormRepository: Repository<Usuario>;

    constructor(
        @InjectRepository(Usuario)
        private ormRepository: Repository<Usuario>,
    ) {
        // this.ormRepository = getRepository(Usuario);
    }

    public async cria(dadosReqUsuario: RequisicaoCriaUsuarioDTO): Promise<Usuario> { // ICreateUsertDTO
        const usuario = this.ormRepository.create(dadosReqUsuario);

        await this.ormRepository.save(usuario);

        return usuario;
    }
}

export default UsuariosRepository;
