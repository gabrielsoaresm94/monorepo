import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentosService {
    getHello(): string {
        return 'Hello World!';
    }
}
