import { Module } from '@nestjs/common';
import { AudiosController } from './audios.controller';
import { AudiosService } from './shared/services/http/audios.service';


@Module({
    imports: [],
    controllers: [AudiosController],
    providers: [AudiosService],
})
export class AudiosModule {}
