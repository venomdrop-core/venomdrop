import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  Account,
  CollectionMintStage,
  CollectionMintStageGroup,
} from '@prisma/client';
import { Me } from 'src/common/decorators/me.decorator';
import {
  ApiPage,
  ApiPageOptions,
  ApiQueryPage,
} from 'src/common/decorators/page.decorator';
import { Collection } from './dto/collection.dto';
import { Graphics } from './dto/graphics.dto';
import { Request } from 'express';
import {
  CreateMintStageGroupResponseDto,
  MintStageGroupDto,
} from './dto/mintstage-group.dto';
import { MintProofResponseDto } from './dto/mint-proof.dto';
import { UploadInterceptor } from './decorators/upload.interceptors.decorator';
import { Upload, UploadResponse } from './dto/upload.dto';

@ApiTags('Collections')
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Me() account: Account,
    @Body() createCollectionDto: CreateCollectionDto,
  ) {
    return this.collectionsService.create(account, createCollectionDto);
  }

  @ApiQueryPage()
  @ApiQuery({
    name: 'owner',
    type: 'string',
    required: false,
  })
  @ApiResponse({
    type: [Collection],
  })
  @Get()
  findAll(@ApiPage() page: ApiPageOptions, @Req() req: Request) {
    const owner = req.query.owner ? (req.query.owner as string) : undefined;
    return this.collectionsService.findAll({ page, filter: { owner } });
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.collectionsService.findOne(slug);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':slug')
  update(
    @Me() account: Account,
    @Param('slug') slug: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    return this.collectionsService.update(account, slug, updateCollectionDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post(':slug/graphics')
  @UploadInterceptor([
    { name: 'logo', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
    { name: 'featured', maxCount: 1 },
  ])
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Collection Graphics',
    type: Graphics,
  })
  uploadGraphics(
    @Req() req: Request,
    @Me() account: Account,
    @Param('slug') slug: string,
  ) {
    const graphics: {
      logoImageSrc?: string;
      coverImageSrc?: string;
      featuredImageSrc?: string;
    } = {};
    const files = req.files as {
      logo?: Express.MulterS3.File[];
      cover?: Express.MulterS3.File[];
      featured?: Express.MulterS3.File[];
    };
    Object.keys(files).forEach((key: keyof typeof files) => {
      if (['logo', 'cover', 'featured'].includes(key)) {
        const typeFiles = files[key];
        if (typeFiles && typeFiles.length > 0) {
          const f = typeFiles[0];
          const fileName = `${f.fieldname}ImageSrc` as keyof typeof graphics;
          graphics[fileName] = f.location;
        }
      }
    });
    return this.collectionsService.updateGraphics(account, slug, graphics);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiBody({
    description: 'Mint Stage Group',
    type: MintStageGroupDto,
  })
  @ApiResponse({
    type: CreateMintStageGroupResponseDto,
  })
  @Post(':slug/mintstage-groups')
  createMintStageGroup(
    @Me() account: Account,
    @Param('slug') slug: string,
    @Body() mintStageGroupDto: MintStageGroupDto,
  ): Promise<CreateMintStageGroupResponseDto> {
    return this.collectionsService.createMintStageGroup(
      account,
      slug,
      mintStageGroupDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiResponse({
    type: CreateMintStageGroupResponseDto,
  })
  @Post(':slug/mintstage-groups/:id/activate')
  activateMintStageGroup(
    @Me() account: Account,
    @Param('slug') slug: string,
    @Param('id') id: string,
  ): Promise<{ status: boolean }> {
    return this.collectionsService.activateMintStageGroup(account, slug, id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiResponse({
    type: MintStageGroupDto,
  })
  @Get(':slug/mintstage-groups/active')
  getActiveMintStageGroup(
    @Me() account: Account,
    @Param('slug') slug: string,
  ): Promise<CollectionMintStageGroup & { mintStages: CollectionMintStage[] }> {
    return this.collectionsService.getCurrentMintStageGroup(account, slug);
  }

  @ApiResponse({
    type: MintProofResponseDto,
    description: 'An array of hex values used for the MerkleTree proof',
  })
  @Get(':slug/mint-proof/:address')
  getMintProofForAddress(
    @Param('slug') slug: string,
    @Param('address') address: string,
  ): Promise<MintProofResponseDto> {
    return this.collectionsService.getMintProofForAddress(slug, address);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post(':slug/upload')
  @UploadInterceptor([{ name: 'file', maxCount: 1 }])
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The uploaded file url',
    type: Upload,
  })
  @ApiResponse({
    description: 'The uploaded file public URL',
    type: UploadResponse,
  })
  updatePreReveal(@Req() req: Request) {
    const files = req.files as {
      file?: Express.MulterS3.File[];
    };
    if (!files.file?.length) {
      throw new BadRequestException();
    }
    const file = files.file[0];
    const url = file.location;
    const mimetype = file.mimetype;
    return {
      url,
      mimetype,
    };
  }
}
