import { ApiProperty } from '@nestjs/swagger';

export class RevealedTokenDto {
  @ApiProperty()
  tokenId: number;

  @ApiProperty()
  address: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  imageUrl?: string;

  @ApiProperty()
  metadataJson: string;
}
