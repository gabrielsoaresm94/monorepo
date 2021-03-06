import { extname } from 'path';
import { hash, compare } from 'bcryptjs';
import { Request } from 'express';

/**
 * Gera hash para criação de usuário.
 *
 * @param payload
 * @returns
 */
export const geraHash = (payload: string): Promise<string> => {
    return hash(payload, 8);
};

/**
 * Compara hash criado com o existente.
 *
 * @param payload
 * @param hashed
 * @returns
 */
export const comparaHash = (
    payload: string,
    hashed: string,
): Promise<boolean> => {
    return compare(payload, hashed);
};

/**
 * Trata envio de multiplos arquivos,
 * para aceitar apenas imagens com as respectivas extenções.
 *
 * @param req
 * @param file
 * @param callback
 * @returns
 */
export const imageFileFilter = (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error, acceptFile: boolean) => void,
): void => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
};

/**
 * Trata nome dos multiplos arquivos enviados.
 *
 * @param req
 * @param file
 * @param callback
 */
export const editFileName = (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error, filename: string) => void,
): void => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};
