import { hash, compare } from 'bcryptjs';

/**
 * Converte segundos para milisegundos
 *
 * @param segundos Quantidade de segundos a ser convertida
 */
export const segundosToMs = (segundos: number): number => segundos * 1000;

/**
 * Converte a quantidade de minutos para milisegundos
 *
 * @param minutos Quantidade em minutos a ser convertitda
 */
export const minutosToMs = (minutos: number): number =>
    minutos * segundosToMs(60);

/**
 * Gera hash para criação de usuário
 *
 * @param payload
 * @returns
 */
export const geraHash = (payload: string): Promise<string> => {
    return hash(payload, 8);
};

/**
 * Compara hash criado com o existente
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
