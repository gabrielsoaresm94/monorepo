import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class RequisicaoEncontraUsuarioDTO {
    @IsNotEmpty({ message: 'usuario_id é necessário' })
    @ApiProperty({
        type: 'string',
        example: 'c6ae78d2-24e8-42c4-ac58-92dc0c375805'
    })
    usuario_id: string;
}

export class RequisicaoListaUsuariosDTO {
    @IsOptional()
    @ApiProperty({
        type: 'string',
        example: 'c6ae78d2-24e8-42c4-ac58-92dc0c375805'
    })
    usuario_id: string;

    @IsOptional()
    @ApiProperty({
        type: 'string',
        example: 'fulano@email.com'
    })
    email: string;
}
