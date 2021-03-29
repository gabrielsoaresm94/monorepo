import { IsEmail, IsNotEmpty } from "class-validator";

export class RequisicaoLoginDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    senha: string;
}
