import { ApiProperty } from '@nestjs/swagger';

export class Graphics {
  @ApiProperty({ type: 'string', format: 'binary' })
  logo: any;

  @ApiProperty({ type: 'string', format: 'binary' })
  cover: any;

  @ApiProperty({ type: 'string', format: 'binary' })
  featured: any;
}
