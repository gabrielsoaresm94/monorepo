import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';
import { Role } from 'src/shared/guards/ role.enum';

export class RequisicaoEditaUsuarioDTO {
    @IsOptional()
    @ApiProperty({
        type: 'string',
        example: 'Beltrano da Silva'
    })
    nome: string;

    @IsOptional()
    @IsEmail()
    @ApiProperty({
        type: 'string',
        example: 'beltrano@email.com'
    })
    email: string;

    @IsOptional()
    @ApiProperty({
        type: 'string',
        example: 'usuario'
    })
    papel: Role.ADMIN | Role.USUARIO;
}
