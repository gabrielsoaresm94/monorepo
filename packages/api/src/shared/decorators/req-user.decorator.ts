import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { verify } from 'jsonwebtoken';

interface TokenPayload {
    id: string;
    email: string;
    nome: string;
    exp: number;
    sub: string;
}

/**
 * Retorna chave do usuário, se houver
 * @returns chave do usuário
 */
export const RequestUser = createParamDecorator(
    (_, contexto: ExecutionContext): string => {
        const request = contexto.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        const [, token] = authHeader.split(' ');

        const decoded = verify(token, process.env.TOKEN_SEGREDO);

        console.log(decoded, 1);

        const { id } = decoded as TokenPayload;

        return id;
    },
);
