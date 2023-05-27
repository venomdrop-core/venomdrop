import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Account } from '@prisma/client';
import { Me } from 'src/common/decorators/me.decorator';
import {
  ApiPage,
  ApiPageOptions,
  ApiQueryPage,
} from 'src/common/decorators/page.decorator';
import { Collection } from './dto/collection.dto';

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
  @ApiResponse({
    type: [Collection],
  })
  @Get()
  findAll(@ApiPage() page: ApiPageOptions) {
    return this.collectionsService.findAll({ page });
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
}
