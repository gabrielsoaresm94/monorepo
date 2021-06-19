import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from 'src/shared/guards/ role.enum';

export class RequisicaoCriaUsuarioDTO {
    @IsNotEmpty({ message: 'nome é necessário' })
    @ApiProperty({
        type: 'string',
        example: 'Fulano dos Santos'
    })
    nome: string;

    @IsNotEmpty({ message: 'email é necessário' })
    @IsEmail()
    @ApiProperty({
        type: 'string',
        example: 'fulano@email.com'
    })
    email: string;

    @IsNotEmpty({ message: 'senha é necessária' })
    @ApiProperty({
        type: 'string',
        example: '123456'
    })
    senha: string;

    @IsNotEmpty({ message: 'papel é necessário' })
    @ApiProperty({
        type: 'string',
        example: 'usuario'
    })
    papel: Role.ADMIN | Role.USUARIO;
}
