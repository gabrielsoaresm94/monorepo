import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class RequisicaoRegistroDTO {
    @IsNotEmpty()
    @ApiProperty({
        type: 'string',
        example: 'Fulano dos Santos'
    })
    nome: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        type: 'string',
        example: 'fulano@email.com'
    })
    email: string;

    @IsNotEmpty()
    @ApiProperty({
        type: 'string',
        example: '123456'
    })
    senha: string;
}
