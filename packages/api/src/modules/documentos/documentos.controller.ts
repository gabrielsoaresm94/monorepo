import * as fs from 'fs';
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
    Res,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import {
    FileInterceptor,
    FilesInterceptor,
} from '@nestjs/platform-express/multer';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/shared/functions/utils';
import { DocumentosService } from './shared/services/http/documentos.service';
import { RequestUser } from 'src/shared/decorators/req-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/guards/roles.decorator';
import { Role } from 'src/shared/guards/ role.enum';

@ApiTags('Documentos')
@Controller('documentos')
export class DocumentosController {
    constructor(private readonly documentosService: DocumentosService) {}

    /**
     * TODO
     * Métodos para geranciar documentos, de um usuário,
     * que contém 1 ou N páginas.
     */
    // listaDocumentos();
    // encontraDocumento();
    // editaDocumento();
    // removeDocumento();

    @HttpCode(201)
    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.USUARIO)
    @UseInterceptors(
        FilesInterceptor('image', 10, {
            storage: diskStorage({
                destination: '../../shared/images', // || Amazon S3, TODO - pesquisar sobre
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    async criaDocumento(
        @Query() dadosReqCriaDocumento,
        @UploadedFiles() paginas,
        @RequestUser() usuario_id: string,
        @Res() res: Response,
    ) {
        try {
            const { nome, descricao, assunto } = dadosReqCriaDocumento;

            /**
             * Adiciona propriedades das imagens enviadas,
             * no vetor
             */
            const imagens = [];
            paginas.forEach(file => {
                const fileReponse = {
                    nome_original: file.originalname,
                    nome_arquivo: file.filename,
                    size: file.size / (1024*1024),
                    format: file.mimetype
                };
                imagens.push(fileReponse);
            });

            const documento = await this.documentosService.criaDocumento(
                usuario_id,
                nome,
                descricao,
                assunto,
                imagens.length
            );
            const paginasCriadas = [];

            if (documento) {
                for (const objPagina of imagens) {
                    const nome = objPagina.nome_arquivo;
                    const tamanho = `${(objPagina.size).toFixed(2)} mb`;
                    const formato = objPagina.format;

                    const pagina = await this.documentosService.criaPagina(
                        usuario_id,
                        documento.documento_id,
                        nome,
                        tamanho,
                        formato
                    );

                    paginasCriadas.push(pagina);

                    if (!pagina) {
                        // TODO - remover página criada.
                    }
                }
            } else {
                // TODO - remover documnto criado.
            }

            if (!documento.paginas) {
                documento.paginas = paginasCriadas;
            }

            /**
             * Services e repositories para:
             * Salvar documento,
             * Salvar página,
             * Rolback não funciona na controller :/
             */
            return res.status(HttpStatus.CREATED).json({
                message:
                    '[INFO] {criaDocumento} - Documento criado com sucesso.',
                metadata: documento,
                status: true,
            });
        } catch (erro) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message:
                    '[ERRO] {criaDocumento} - Problemas para criar documento.',
                erro: erro.message,
                status: false,
            });
        }
    }
}
