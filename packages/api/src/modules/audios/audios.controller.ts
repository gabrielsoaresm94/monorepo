import { Controller, Get } from '@nestjs/common';
import { AudiosService } from './shared/services/http/audios.service';

@Controller()
export class AudiosController {
    constructor(private readonly audiosService: AudiosService) {}

    @Get()
    getHello(): string {
        return this.audiosService.getHello();
    }
}
