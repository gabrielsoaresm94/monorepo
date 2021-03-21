import { Injectable } from '@nestjs/common';

@Injectable()
export class AudiosService {
    getHello(): string {
        return 'Hello World!';
    }
}
