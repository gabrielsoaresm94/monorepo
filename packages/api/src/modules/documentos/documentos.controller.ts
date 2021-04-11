import * as fs from 'fs';
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
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
import { RequisicaoCriaDocumentoDTO } from './shared/dtos/req-post.dto';
import { RequisicaoListaDocumentosDTO } from './shared/dtos/req-get.dto';

@ApiTags('Documentos')
@Controller('documentos')
export class DocumentosController {
    constructor(private readonly documentosService: DocumentosService) {}

    /**
     * TODO - Adicionar DTOs,
     * num futuro rolbacks
     */
    // editaDocumento();
    // removeDocumento();

    /**
     * TODO - relacionamento com páginas dando problema
     */
    @HttpCode(200)
    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.USUARIO)
    async listaDocumentos(
        @Query() dadosReqListaDocumentos: RequisicaoListaDocumentosDTO,
        @RequestUser() usuario_id: string,
        @Res() res: Response,
    ): Promise<Response> {
        try {
            const { assunto } = dadosReqListaDocumentos;

            const documentos = await this.documentosService.listaDocumentos(
                usuario_id,
            );

            return res.status(HttpStatus.CREATED).json({
                message:
                    '[INFO] {listaDocumentos} - Documentos listados com sucesso.',
                metadata: documentos,
                status: true,
            });
        } catch (erro) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message:
                    '[ERRO] {listaDocumentos} - Problemas para listar documentos.',
                erro: erro.message,
                status: false,
            });
        }
    }

    @HttpCode(200)
    @Get(':documento_id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.USUARIO)
    async encontraDocumento(
        @Param() chaveDocumento: { documento_id: string },
        @RequestUser() usuario_id: string,
        @Res() res: Response,
    ): Promise<Response> {
        try {
            const { documento_id } = chaveDocumento;
            const documento = await this.documentosService.encontraDocumento(
                usuario_id,
                documento_id,
            );

            return res.status(HttpStatus.CREATED).json({
                message:
                    '[INFO] {encontraDocumento} - Documento encotrado com sucesso.',
                metadata: documento,
                status: true,
            });
        } catch (erro) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message:
                    '[ERRO] {encontraDocumento} - Problemas para encontrar documento.',
                erro: erro.message,
                status: false,
            });
        }
    }

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
        @Query() dadosReqCriaDocumento: RequisicaoCriaDocumentoDTO,
        @UploadedFiles() paginas,
        @RequestUser() usuario_id: string,
        @Res() res: Response,
    ): Promise<Response> {
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
                    size: file.size / (1024 * 1024),
                    format: file.mimetype,
                };
                imagens.push(fileReponse);
            });

            const documento = await this.documentosService.criaDocumento(
                usuario_id,
                nome,
                descricao,
                assunto,
                imagens.length,
            );

            if (documento) {
                for (const objPagina of imagens) {
                    const nome = objPagina.nome_arquivo;
                    const tamanho = `${objPagina.size.toFixed(2)} mb`;
                    const formato = objPagina.format;

                    const pagina = await this.documentosService.criaPagina(
                        usuario_id,
                        documento.documento_id,
                        nome,
                        tamanho,
                        formato,
                    );

                    if (!pagina) {
                        // TODO - remover página criada.
                    }
                }
            } else {
                // TODO - remover documnto criado.
                return res.status(HttpStatus.CREATED).json({
                    message:
                        '[ERRO] {criaDocumento} - Problemas para criar documento.',
                    metadata: {
                        documento_id: documento.documento_id,
                        nome: documento.nome,
                    },
                    status: true,
                });
            }

            /**
             * TODO - Rolback, para problemas no auth não funciona na controller :/
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
