import { ApiProperty } from '@nestjs/swagger';

export class Account {
  @ApiProperty({
    description: 'The account id on VenomDrop',
  })
  id: string;

  @ApiProperty({
    description: 'The account wallet address VenomDrop',
  })
  address: string;
}
