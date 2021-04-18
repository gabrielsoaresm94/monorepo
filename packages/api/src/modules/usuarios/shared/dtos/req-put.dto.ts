import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from 'src/shared/guards/ role.enum';

export class RequisicaoEditaUsuarioDTO {
    nome: string;

    @IsEmail()
    email: string;

    papel: Role.ADMIN | Role.USUARIO;
}
