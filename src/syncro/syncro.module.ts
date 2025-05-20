import { Module } from '@nestjs/common';
import { SyncroController } from './syncro.controller';
import { SyncroService } from './syncro.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [SyncroController],
  providers: [SyncroService],
})
export class SyncroModule {}
