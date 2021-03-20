/**
 * Converte segundos para milisegundos
 *
 * @param segundos Quantidade de segundos a ser convertida
 */
 export const segundosToMs = (segundos : number): number => (segundos * 1000);

 /**
  * Converte a quantidade de minutos para milisegundos
  *
  * @param minutos Quantidade em minutos a ser convertitda
  */
 export const minutosToMs = (minutos : number): number => (minutos * segundosToMs(60));