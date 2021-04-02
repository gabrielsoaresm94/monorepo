import { IsEmail, IsNotEmpty } from "class-validator";

export class RequisicaoRegistroDTO {
    @IsNotEmpty()
    nome: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    senha: string;
}
