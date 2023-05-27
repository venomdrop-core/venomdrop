import { Module } from '@nestjs/common';
import { MeController } from './me.controller';

@Module({
  controllers: [MeController],
  providers: [],
})
export class MeModule {}
