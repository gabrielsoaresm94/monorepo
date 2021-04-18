/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

/**
 * Modelo de retorno de mensagens de funções auxiliares
 */
export class MessageStatus {
    /**
     * Mensagem de retorno da operação
     */
    @ApiProperty()
    message: string;

    /**
     * Status da operação
     */
    @ApiProperty()
    status: boolean;

    /**
     * Codigo HTTP da operacao
     */
    httpStatus?: number;

    /**
     * Dados extras
     */
    @ApiProperty()
    metadata?: any;

    /**
     * Retorna detalhes técnicos do problema [opcional]
     */
    erro?: string | Array<string>;

    /**
     * Construtor de objetos de retorno
     *
     * @param message
     * @param metadata
     * @param erro
     */
    constructor(
        message: string,
        metadata?: any,
        erro?: string,
        httpStatus?: number,
    ) {
        this.metadata = metadata ? metadata : {};
        this.message = message;
        if (erro) {
            this.status = false;
            this.erro = erro;
            this.httpStatus = httpStatus
                ? httpStatus
                : HttpStatus.INTERNAL_SERVER_ERROR;
        } else {
            this.status = true;
            this.httpStatus = httpStatus ? httpStatus : HttpStatus.OK;
        }
    }
}
