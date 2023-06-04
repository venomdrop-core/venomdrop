import { ApiProperty } from '@nestjs/swagger';

export class Upload {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

export class UploadResponse {
  @ApiProperty({ type: 'string' })
  url: string;

  @ApiProperty({ type: 'string' })
  mimetype: string;
}
