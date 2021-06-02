import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class RequisicaoLoginDTO {
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
