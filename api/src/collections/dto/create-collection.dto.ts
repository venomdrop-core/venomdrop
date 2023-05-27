import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCollectionDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'The collection name',
    example: 'My Collection',
  })
  name: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The collection description',
    example: 'My Description',
  })
  description: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The collection slug',
    example: 'my-collection',
  })
  slug: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The category slug',
    uniqueItems: false,
    example: 'photography',
  })
  categorySlug: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The VenomDropCollection contract address',
    uniqueItems: false,
    example:
      '0:e39b3c712a8ff98ff154de73a25bca572189d5c7c958b28600c29cd7923247a4',
  })
  contractAddress: string;
}
