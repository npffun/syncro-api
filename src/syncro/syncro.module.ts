import { Module } from '@nestjs/common';
import { SyncroController } from './syncro.controller';
import { SyncroService } from './syncro.service';

@Module({
  controllers: [SyncroController],
  providers: [SyncroService],
})
export class SyncroModule {}
