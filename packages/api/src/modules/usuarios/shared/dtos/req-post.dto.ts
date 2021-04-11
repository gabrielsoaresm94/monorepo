import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from 'src/shared/guards/ role.enum';

export class RequisicaoCriaUsuarioDTO {
    @IsNotEmpty()
    nome: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    senha: string;

    @IsNotEmpty()
    papel: Role.ADMIN | Role.USUARIO;
}
