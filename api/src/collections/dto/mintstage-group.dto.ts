import { ApiProperty } from '@nestjs/swagger';
import { MintStageType, Prisma } from '@prisma/client';

export class AllowlistDataItemDto {
  @ApiProperty({
    example:
      '0:e39b3c712a8ff98ff154de73a25bca572189d5c7c958b28600c29cd7923247a4',
  })
  address: string;
}

export class MintStageDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  price: string;

  @ApiProperty()
  type: MintStageType;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty({
    type: [AllowlistDataItemDto],
  })
  @ApiProperty()
  allowlistData: AllowlistDataItemDto[];
}

export class MintStageGroupDto {
  @ApiProperty({
    type: [MintStageDto],
  })
  mintStages: MintStageDto[];
}

export class CreateMintStageGroupResponseDto {
  @ApiProperty()
  mintStageGroupId: string;

  @ApiProperty()
  merkleTreeRoots: string[];
}
