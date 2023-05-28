import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { PrismaService } from 'src/prisma.service';
import { VenomService } from 'src/venom.service';
import { Account, Prisma } from '@prisma/client';
import { ApiPageOptions } from 'src/common/decorators/page.decorator';

@Injectable()
export class CollectionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly venomService: VenomService,
  ) {}

  async create(
    account: Account,
    {
      name,
      slug,
      categorySlug,
      description,
      contractAddress,
    }: CreateCollectionDto,
  ) {
    const validContractAddress =
      await this.venomService.validCollectionContractForOwner(
        contractAddress,
        account.address,
      );
    if (!validContractAddress) {
      throw new BadRequestException('Invalid Contract Address');
    }
    return this.prismaService.collection.create({
      data: {
        name,
        description,
        contractAddress,
        slug,
        category: {
          connect: {
            slug: categorySlug,
          },
        },
        owner: {
          connect: {
            id: account.id,
          },
        },
      },
    });
  }

  findAll({ page }: { page: ApiPageOptions }) {
    return this.prismaService.collection.findMany({
      ...page,
      include: {
        category: true,
      },
    });
  }

  async findOne(slug: string) {
    const collection = await this.prismaService.collection.findUnique({
      where: {
        slug,
      },
      include: {
        category: true,
      },
    });
    if (!collection) {
      throw new NotFoundException();
    }
    return collection;
  }

  async update(account: Account, slug: string, data: UpdateCollectionDto) {
    const c = await this.findOne(slug);
    if (c.ownerId !== account.id) {
      throw new ForbiddenException();
    }
    const updateData: Prisma.CollectionUpdateInput = {
      name: data.name,
      description: data.description,
      slug: data.slug,
    };
    if (data.categorySlug) {
      updateData.category = {
        connect: {
          slug: data.categorySlug,
        },
      };
    }
    const collection = await this.prismaService.collection.update({
      where: {
        slug,
      },
      data: updateData,
    });
    if (!collection) {
      throw new NotFoundException();
    }
    return collection;
  }

  async updateGraphics(
    account: Account,
    slug: string,
    graphics: {
      logoImageSrc?: string;
      coverImageSrc?: string;
      featuredImageSrc?: string;
    },
  ) {
    const c = await this.findOne(slug);
    if (c.ownerId !== account.id) {
      throw new ForbiddenException();
    }
    const collection = await this.prismaService.collection.update({
      where: {
        slug,
      },
      data: {
        ...graphics,
      },
    });
    return collection;
  }
}
