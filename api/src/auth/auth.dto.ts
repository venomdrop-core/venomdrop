import { ApiProperty } from '@nestjs/swagger';

export class CreateNonceInput {
  @ApiProperty({
    description: 'The account address',
  })
  address: string;

  @ApiProperty({
    description: 'The account contract type EverWallet or WalletV3',
  })
  contractType: string;

  @ApiProperty({
    description: 'The account public key',
  })
  publicKey: string;
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
    description: 'The nonce generated on /auth/nonce',
  })
  nonce: string;

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
