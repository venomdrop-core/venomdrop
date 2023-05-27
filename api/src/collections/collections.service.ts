import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { PrismaService } from 'src/prisma.service';
import { VenomService } from 'src/venom.service';
import { Account } from '@prisma/client';

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

  findAll() {
    return `This action returns all collections`;
  }

  findOne(id: number) {
    return `This action returns a #${id} collection`;
  }

  update(id: number, updateCollectionDto: UpdateCollectionDto) {
    return `This action updates a #${id} collection`;
  }

  remove(id: number) {
    return `This action removes a #${id} collection`;
  }
}
