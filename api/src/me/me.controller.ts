import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Me } from 'src/common/decorators/me.decorator';
import { Account } from './account.dto';

@ApiTags('Me')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('me')
export class MeController {
  @ApiResponse({
    description: 'The authenticated account',
    type: Account,
  })
  @Get()
  me(@Me() me: Account) {
    return me;
  }
}
