import { ApiProperty } from '@nestjs/swagger';

export class SetPublishStatusDto {
  @ApiProperty({
    enum: ['DRAFT', 'PUBLISHED'],
  })
  status: 'DRAFT' | 'PUBLISHED';
}
