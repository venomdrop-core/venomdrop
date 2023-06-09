import { ApiProperty } from '@nestjs/swagger';

export class SlugAvailabilityResponseDto {
  @ApiProperty()
  status: boolean;

  @ApiProperty()
  suggestions: string[];
}
