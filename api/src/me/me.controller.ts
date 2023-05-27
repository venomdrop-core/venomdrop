import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Me } from 'src/auth/auth.me.decorator';
import { MeDto } from './me.dto';
import { Account } from '@prisma/client';

@ApiTags('Me')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('me')
export class MeController {
  @ApiResponse({
    description: 'The authenticated account',
    type: MeDto,
  })
  @Get()
  me(@Me() me: Account) {
    return me;
  }
}
