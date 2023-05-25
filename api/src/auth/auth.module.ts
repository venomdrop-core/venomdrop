import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { VenomService } from 'src/venom.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, VenomService],
})
export class AuthModule {}
