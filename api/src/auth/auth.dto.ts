import { ApiProperty } from '@nestjs/swagger';

export class CreateNonceInput {
  @ApiProperty({
    description: 'The account address to generate the nonce',
  })
  address: string;
}

export class CreateNonceResponse {
  @ApiProperty({
    description:
      'A random UUID used to generate the message to be signed on frontend',
  })
  nonce: string;
}

export class CompleteAuthInput {
  @ApiProperty({
    description: 'The account address that generated the signed message',
  })
  address: string;

  @ApiProperty({
    description: 'The signed message using Venom Wallet on frontend',
  })
  signedMessage: string;
}

export class CompleteAuthResponse {
  @ApiProperty({
    description: 'The auth JWT token',
  })
  token: string;
}
