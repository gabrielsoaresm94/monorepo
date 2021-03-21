import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { MessageStatus } from 'src/shared/erros.helper';
import { UsuariosService } from './shared/services/http/usuarios.service';

@Controller()
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}

    @Get()
    // @UseGuards(
    //   AuthGuard,
    //   RolesGuard1
    // @Roles(PapelUsuario.ADMINISTRADOR)
    // @ApiBearerAuth()
    @ApiOperation({ summary: 'Listagem de usuários' })
    @ApiOkResponse({
        description: 'Consulta obtida com sucesso',
        type: MessageStatus,
    })
    @ApiForbiddenResponse({
        description: '[ERRO] {GET - /usuarios} - Acesso negado',
        schema: {
            example: {
                message: '[ERRO] {GET - /usuarios} - Usuário não tem permissão',
                status: false,
                erro: 'Usuário não tem permissão',
            },
            type: 'MessageStatus',
        },
    })
    @ApiInternalServerErrorResponse({
        description: '[ERRO] {GET - /usuarios} - Erro do servidor',
        schema: {
            example: {
                message: '[ERRO] {GET - /usuarios} - Ocorreu um erro',
                status: false,
                erro: 'Erro ao inicializar objeto',
            },
            type: 'MessageStatus',
        },
    })
    async listaUsuarios(@Res() res: Response): Promise<any> {
        try {
            // console.log(process.env.USER, 1000);

            return res.status(HttpStatus.OK).json({
                message:
                    '[INFO] {listaUsuarios} - Usuários listados com sucesso',
                status: true,
            });
        } catch (erro) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message:
                    '[ERRO] {listaUsuarios} - Problemas para listar usuários.',
                erro: erro.message,
                status: false,
            });
        }
    }

    @Get('usuarios')
    getHello(): string {
        return this.usuariosService.getHello();
    }
}
