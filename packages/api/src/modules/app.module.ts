import { Module } from '@nestjs/common';
import { AppController } from './usuarios/app.controller';
import { AppService } from './usuarios/app.service';

@Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
