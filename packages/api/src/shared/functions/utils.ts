import * as fs from 'fs';
import { extname } from 'path';
import { hash, compare } from 'bcryptjs';

/**
 * Converte segundos para milisegundos.
 *
 * @param segundos Quantidade de segundos a ser convertida
 */
export const segundosToMs = (segundos: number): number => segundos * 1000;

/**
 * Converte a quantidade de minutos para milisegundos.
 *
 * @param minutos Quantidade em minutos a ser convertitda
 */
export const minutosToMs = (minutos: number): number =>
    minutos * segundosToMs(60);

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
export const imageFileFilter = (req, file, callback) => {
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
export const editFileName = (req, file, callback) => {
    // const stats = fs.statSync(file.originalname)
    // const fileSizeInBytes = stats.size;
    // // Convert the file size to megabytes (optional)
    // const fileSizeInMegabytes = fileSizeInBytes / (1024*1024);
    // file.size = fileSizeInMegabytes;

    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};
