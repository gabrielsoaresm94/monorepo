import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

export class RequisicaoEditaPerfilDTO {
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
}
