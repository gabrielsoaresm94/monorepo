import { IsNotEmpty } from 'class-validator';

export class RequisicaoCriaDocumentoDTO {
    @IsNotEmpty()
    nome: string;

    descricao: string;

    assunto: string;
}
