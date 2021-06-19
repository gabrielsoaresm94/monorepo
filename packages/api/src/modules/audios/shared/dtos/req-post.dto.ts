import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RequisicaoCriaAudioDTO {
    @IsNotEmpty({ message: 'documento_id é necessário' })
    @ApiProperty({
        type: 'string',
        example: 'c6ae78d2-24e8-42c4-ac58-92dc0c375805'
    })
    documento_id: string;
}
