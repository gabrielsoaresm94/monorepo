import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { MessageStatus } from 'src/shared/erros.helper';
import { Role } from 'src/shared/guards/ role.enum';
import { Roles } from 'src/shared/guards/roles.decorator';
import { RequisicaoCriaUsuarioDTO } from './shared/dtos/req-post.dto';
import { UsuariosService } from './shared/services/http/usuarios.service';

@Controller()
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}

    @Get()
    getHello(): string {
        return this.usuariosService.getHello();
    }

    /**
     * TODO
     * Métodos privados para o administrador gerenciar usuários,
     * não permitir edição da propriedade papel;
     * Criar auth, para saber se o usuário é permitido e diferenciar
     * usuários de admins;
     * Adicionar verificação para propriedades na requisição;
     * Adicionar paginação para listas;
     */
     @Get('usuarios')
     // @UseGuards(
     //   AuthGuard,
     //   RolesGuard
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
     async listaUsuarios(@Res() res: Response): Promise<Response> {
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

    // encontraUsuario();

    // @Roles(Role.ADMIN)
    @Post('usuarios')
    async criaUsuario(
        @Body() dadosReqUsuario: RequisicaoCriaUsuarioDTO,
        @Res() res: Response
    ): Promise<Response> {
        try {
            /**
             * TODO:
             * Verifica role de quem chamou o método, apenas admins podem criar admins;
            */
            const {nome, email, senha, papel} = dadosReqUsuario;

            const dadosUsuario = await this.usuariosService.criaUsuario(
                nome,
                email,
                senha,
                papel
            );

            return res.status(HttpStatus.CREATED).json({
                message:
                    '[INFO] {criaUsuario} - Usuário criado com sucesso.',
                metedata: dadosUsuario,
                status: true,
            });
        } catch (erro) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message:
                    '[ERRO] {criaUsuario} - Problemas para criar usuário.',
                erro: erro.message,
                status: false,
            });
        }
    };

    // editaUsuario();

    // removeUsuario();

    /**
     * TODO
     * Métodos públicos para o usuário poder se auto-gerenciar
     */
    // cadastraUsuario();
    // perfil();
    // editarPerfil();
    // resetaSenha();

    /**
     * Sessão de usuários
     */
    // login();
    // logout();
}
