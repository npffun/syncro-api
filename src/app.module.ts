import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SyncroModule } from './syncro/syncro.module';

@Module({
  imports: [SyncroModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
