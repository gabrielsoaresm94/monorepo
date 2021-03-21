import { Module } from '@nestjs/common';
import { UsuariosService } from './shared/services/http/usuarios.service';
import { UsuariosController } from './usuarios.controller';

@Module({
    imports: [],
    controllers: [UsuariosController],
    providers: [UsuariosService],
})
export class UsuariosModule {}
