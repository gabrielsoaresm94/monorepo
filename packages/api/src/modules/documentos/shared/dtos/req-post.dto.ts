import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class RequisicaoCriaDocumentoDTO {
    @IsNotEmpty({ message: 'nome é necessário' })
    @ApiProperty({
        type: 'string',
        example: 'Textos de Jorge Amado'
    })
    nome: string;

    @IsOptional()
    @ApiProperty({
        type: 'string',
        example: 'Alguns textos dos Jorge'
    })
    descricao: string;

    @IsOptional()
    @ApiProperty({
        type: 'string',
        example: 'jorge-amado'
    })
    assunto: string;
}
