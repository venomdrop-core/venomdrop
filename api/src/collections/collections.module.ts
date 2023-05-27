import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { PrismaService } from 'src/prisma.service';
import { VenomService } from 'src/venom.service';

@Module({
  controllers: [CollectionsController],
  providers: [CollectionsService, PrismaService, VenomService],
})
export class CollectionsModule {}
