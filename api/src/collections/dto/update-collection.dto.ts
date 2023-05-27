import { ApiProperty } from '@nestjs/swagger';

export class UpdateCollectionDto {
  @ApiProperty({
    description: 'The collection name',
    example: 'My Collection',
  })
  name?: string;

  @ApiProperty({
    description: 'The collection description',
    example: 'My Description',
  })
  description?: string;

  @ApiProperty({
    description: 'The collection slug',
    example: 'my-collection',
  })
  slug?: string;

  @ApiProperty({
    description: 'The category slug',
    uniqueItems: false,
    example: 'photography',
  })
  categorySlug?: string;
}
