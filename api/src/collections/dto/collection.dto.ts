import { ApiProperty } from '@nestjs/swagger';
import { Account } from 'src/me/account.dto';

export class Collection {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  ownerId: string;

  @ApiProperty({ type: () => Account })
  owner: Account;

  @ApiProperty({ type: String })
  contractAddress: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  slug: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: String })
  categoryId: string;
}
