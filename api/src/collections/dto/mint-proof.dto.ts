import { ApiProperty } from "@nestjs/swagger";

export class MintProofResponseDto {
  @ApiProperty()
  address: string;

  @ApiProperty()
  proof: string[];
}
