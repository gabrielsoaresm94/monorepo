import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './shared/services/http/usuarios.service';
import Usuario from './shared/typeorm/entities/usuario.entity';
import { UsuariosController } from './usuarios.controller';
// import UsuariosRepository from './shared/typeorm/repositories/usuarios.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Usuario])],
    controllers: [UsuariosController],
    providers: [UsuariosService],
})
export class UsuariosModule {}
