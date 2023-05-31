import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
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
import { Account } from '@prisma/client';
import { Me } from 'src/common/decorators/me.decorator';
import {
  ApiPage,
  ApiPageOptions,
  ApiQueryPage,
} from 'src/common/decorators/page.decorator';
import { Collection } from './dto/collection.dto';
import { Graphics } from './dto/graphics.dto';
import { Request } from 'express';
import { GraphicsInterceptors } from './decorators/graphics.interceptors.decorator';

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
  @GraphicsInterceptors()
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
}
