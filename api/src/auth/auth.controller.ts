import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CompleteAuthInput,
  CompleteAuthResponse,
  CreateNonceInput,
  CreateNonceResponse,
} from './auth.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';

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
    const { address } = input;
    return this.authService.createNonce({ address });
  }

  @Post('complete')
  @ApiCreatedResponse({
    type: CompleteAuthResponse,
  })
  async complete(
    @Body() input: CompleteAuthInput,
  ): Promise<CompleteAuthResponse> {
    // TODO: Implement Signature Validation and JWT Token generation
    return {
      token: 'NOT_IMPLEMENTED',
    };
  }
}
