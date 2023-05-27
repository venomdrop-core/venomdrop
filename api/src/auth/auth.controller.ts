import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CompleteAuthInput,
  CompleteAuthResponse,
  CreateNonceInput,
  CreateNonceResponse,
} from './auth.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('nonce')
  @ApiCreatedResponse({
    type: CreateNonceResponse,
  })
  async createNonce(
    @Body() input: CreateNonceInput,
  ): Promise<CreateNonceResponse> {
    return this.authService.createNonce(input);
  }

  @Post('complete')
  @ApiCreatedResponse({
    type: CompleteAuthResponse,
  })
  async complete(
    @Body() input: CompleteAuthInput,
  ): Promise<CompleteAuthResponse> {
    return this.authService.completeAuth(input);
  }
}
