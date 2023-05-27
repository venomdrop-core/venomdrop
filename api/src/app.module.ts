import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import { VenomService } from './venom.service';
import { CollectionsModule } from './collections/collections.module';
import { MeModule } from './me/me.module';

@Module({
  imports: [AuthModule, CollectionsModule, MeModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, VenomService],
})
export class AppModule {}
