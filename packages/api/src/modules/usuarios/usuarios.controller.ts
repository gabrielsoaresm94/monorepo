import { Controller, Get } from '@nestjs/common';
import { UsuariosService } from './shared/services/http/usuarios.service';

@Controller()
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}

    @Get()
    getHello(): string {
        return this.usuariosService.getHello();
    }
}
