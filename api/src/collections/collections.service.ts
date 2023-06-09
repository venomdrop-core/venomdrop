import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Account, CollectionPublishStatus, Prisma } from '@prisma/client';
import { SHA256 } from 'crypto-js';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { PrismaService } from 'src/prisma.service';
import { VenomService } from 'src/venom.service';
import { ApiPageOptions } from 'src/common/decorators/page.decorator';
import {
  CreateMintStageGroupResponseDto,
  MintStageGroupDto,
} from './dto/mintstage-group.dto';
import MerkleTree from 'merkletreejs';
import { Address } from 'everscale-inpage-provider';
import { MintProofResponseDto } from './dto/mint-proof.dto';
import { RevealedTokenDto } from './dto/revealed-token.dto';
import { SetPublishStatusDto } from './dto/publish-status.dto';
import { SlugAvailabilityResponseDto } from './dto/slug-availability.dto';
import ShortUniqueId from 'short-unique-id';

function getAddrHex(address: Address): string {
  const addr = address.toString();
  const uint256 = BigInt(addr.replace('0:', '0x'));
  const hex = uint256.toString(16).padStart(64, '0');
  return hex;
}

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

  findAllPublic(
    {
      page,
      filter,
    }: {
      page: ApiPageOptions;
      filter: { owner?: string; publishStatus?: CollectionPublishStatus[] };
    },
    account?: Account,
  ) {
    const where: Prisma.CollectionFindManyArgs['where'] = {
      OR: [
        {
          publishStatus: 'PUBLISHED',
        },
        {
          ownerId: account?.id,
        },
      ],
    };
    if (filter?.owner) {
      where.owner = {
        address: filter.owner,
      };
    }
    if (filter?.publishStatus) {
      where.publishStatus = {
        in: filter.publishStatus,
      };
    }
    return this.prismaService.collection.findMany({
      ...page,
      include: {
        category: true,
      },
      where,
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

  /**
   * Similar to findOne, the findOnePublic retrieves a collection if meets the following condition:
   *    1. The Collection is published
   *    2. The account (second arg) is the owner of the collection
   * @param slug the collection slug
   * @param account the optional logged account
   * @returns Collection
   */
  async findOnePublic(slug: string, account?: Account) {
    const collection = await this.findOne(slug);
    if (
      !collection ||
      (collection.publishStatus === 'DRAFT' &&
        collection.ownerId !== account?.id)
    ) {
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

  async getMintStageMerkleTree(id: string): Promise<MerkleTree> {
    const mintStage =
      await this.prismaService.collectionMintStage.findUniqueOrThrow({
        where: {
          id,
        },
      });

    const jsonData = mintStage.allowlistData;

    if (!jsonData || !Array.isArray(jsonData)) {
      throw new InternalServerErrorException('Could not parse allowlist data');
    }

    const allowlistData = jsonData as Prisma.JsonArray;

    const addresses = allowlistData
      .map((row: { address: string }) => row.address)
      .map((addr) => new Address(addr));

    const leaves = addresses
      .map(getAddrHex)
      .map((hex: string) => Buffer.from(hex, 'hex'));

    const tree = new MerkleTree(leaves, SHA256, {
      hashLeaves: false,
      sortLeaves: true,
      sortPairs: true,
    });

    return tree;
  }

  async createMintStageGroup(
    account: Account,
    slug: string,
    mintStageGroupDto: MintStageGroupDto,
  ): Promise<CreateMintStageGroupResponseDto> {
    const c = await this.findOne(slug);
    if (c.ownerId !== account.id) {
      throw new ForbiddenException();
    }
    const mintStageGroup =
      await this.prismaService.collectionMintStageGroup.create({
        data: {
          collectionId: c.id,
          active: false,
          mintStages: {
            createMany: {
              data: mintStageGroupDto.mintStages.map((ms, idx) => {
                const allowlistData =
                  ms.allowlistData as unknown as Prisma.JsonArray;
                const createData = {
                  idx,
                  name: ms.name,
                  price: parseInt(ms.price),
                  type: ms.type,
                  allowlistData,
                  startDate: new Date(ms.startDate),
                  endDate: new Date(ms.endDate),
                };
                return createData;
              }),
            },
          },
        },
        include: {
          mintStages: {
            orderBy: {
              idx: 'asc',
            },
          },
        },
      });

    const merkleTreeRoots: string[] = [];

    for (let i = 0; i < mintStageGroup.mintStages.length; i++) {
      const mintStage = mintStageGroup.mintStages[i];
      if (mintStage.type === 'ALLOWLIST') {
        const tree = await this.getMintStageMerkleTree(mintStage.id);
        merkleTreeRoots.push(tree.getHexRoot());
      } else {
        merkleTreeRoots.push('0x0');
      }
    }

    return {
      mintStageGroupId: mintStageGroup.id,
      merkleTreeRoots,
    };
  }

  async activateMintStageGroup(account: Account, slug: string, id: string) {
    const c = await this.findOne(slug);
    if (c.ownerId !== account.id) {
      throw new ForbiddenException();
    }
    const mintGroup =
      await this.prismaService.collectionMintStageGroup.findUnique({
        where: {
          id,
        },
      });
    if (mintGroup?.collectionId !== c.id) {
      throw new ForbiddenException();
    }
    // Deactivating all previous mintstage group
    await this.prismaService.collectionMintStageGroup.updateMany({
      where: {
        collectionId: c.id,
      },
      data: {
        active: false,
      },
    });
    // Activating the selected MintStageGroup
    await this.prismaService.collectionMintStageGroup.update({
      where: {
        id: mintGroup.id,
      },
      data: {
        active: true,
      },
    });
    return {
      status: true,
    };
  }

  async getMintProofForAddress(
    slug: string,
    address: string,
  ): Promise<MintProofResponseDto> {
    const now = new Date();
    const currentMintStage =
      await this.prismaService.collectionMintStage.findFirst({
        where: {
          mintStageGroup: {
            collection: {
              slug,
            },
            active: true,
          },
          startDate: {
            lt: now,
          },
          endDate: {
            gt: now,
          },
        },
      });
    if (!currentMintStage) {
      throw new BadRequestException('No current mint stage');
    }
    const tree = await this.getMintStageMerkleTree(currentMintStage.id);
    const leaf = Buffer.from(getAddrHex(new Address(address)), 'hex');
    const proof = tree.getHexProof(leaf);
    const eligible = tree.verify(
      tree.getProof(leaf),
      leaf,
      tree.getRoot().toString('hex'),
    );
    return {
      address,
      proof,
      eligible,
    };
  }

  async getCurrentMintStageGroup(account: Account, slug: string) {
    const c = await this.findOne(slug);
    if (c.ownerId !== account.id) {
      throw new ForbiddenException();
    }
    const mintStageGroup =
      await this.prismaService.collectionMintStageGroup.findFirst({
        where: {
          active: true,
          collection: {
            slug,
          },
        },
        include: {
          mintStages: {
            orderBy: {
              idx: 'asc',
            },
          },
        },
      });
    if (!mintStageGroup) {
      throw new NotFoundException('MintStageGroup not found');
    }
    return mintStageGroup;
  }

  async findAllRevealedTokens({
    account,
    slug,
    page,
  }: {
    account: Account;
    slug: string;
    page: ApiPageOptions;
  }) {
    const c = await this.findOne(slug);
    if (c.ownerId !== account.id) {
      throw new ForbiddenException();
    }
    const where: Prisma.CollectionRevealedTokenFindManyArgs['where'] = {
      collection: {
        slug,
      },
    };
    return this.prismaService.collectionRevealedToken.findMany({
      ...page,
      where,
    });
  }

  async createRevealedToken(
    account: Account,
    slug: string,
    revealedTokenDto: RevealedTokenDto,
  ) {
    const c = await this.findOne(slug);
    if (c.ownerId !== account.id) {
      throw new ForbiddenException();
    }
    const existing = await this.prismaService.collectionRevealedToken.findFirst(
      {
        where: {
          collectionId: c.id,
          tokenId: revealedTokenDto.tokenId,
        },
      },
    );
    if (existing) {
      return this.prismaService.collectionRevealedToken.update({
        where: {
          id: existing.id,
        },
        data: {
          name: revealedTokenDto.name,
          imageUrl: revealedTokenDto.imageUrl,
          metadataJson: revealedTokenDto.metadataJson,
        },
      });
    }
    return this.prismaService.collectionRevealedToken.create({
      data: {
        address: revealedTokenDto.address,
        collectionId: c.id,
        tokenId: revealedTokenDto.tokenId,
        name: revealedTokenDto.name,
        imageUrl: revealedTokenDto.imageUrl,
        metadataJson: revealedTokenDto.metadataJson,
      },
    });
  }

  private async _updatePublishStatus(
    collectionId: string,
    publishStatus: CollectionPublishStatus,
  ) {
    await this.prismaService.collection.update({
      where: {
        id: collectionId,
      },
      data: {
        publishStatus,
      },
    });
  }

  async setPublishStatus(
    account: Account,
    slug: string,
    setPublishStatusDto: SetPublishStatusDto,
  ) {
    const c = await this.findOne(slug);
    if (c.ownerId !== account.id) {
      throw new ForbiddenException();
    }
    const { status } = setPublishStatusDto;
    if (status === 'DRAFT') {
      await this._updatePublishStatus(c.id, 'DRAFT');
      return;
    }
    const validForPublished = c.name && c.logoImageSrc && c.coverImageSrc;
    if (!validForPublished) {
      throw new BadRequestException('Collection is not valid to be published');
    }
    await this._updatePublishStatus(c.id, 'PUBLISHED');
  }

  /**
   * This function checks if a collection slug is available.
   *
   * Case the slug is not available, we generate some available suggestions
   * based on the provided name. (Variations with random strings at the end)
   *
   * @param slug the slug to check availability
   * @returns SlugAvailabilityResponseDto
   */
  async getSlugAvailability(
    slug: string,
  ): Promise<SlugAvailabilityResponseDto> {
    const c = await this.prismaService.collection.findUnique({
      where: {
        slug,
      },
    });
    if (c === null) {
      return {
        status: true,
        suggestions: [],
      };
    }

    const uid = new ShortUniqueId();

    const numericSlugs = Array.from(Array(3).keys()).map(
      (idx) => `${slug}-${idx + 1}`,
    );

    const randomSlugs = Array.from(Array(3).keys())
      .map(() => uid())
      .map((id) => `${slug}-${id.toString()}`);

    const slugs = [...numericSlugs, ...randomSlugs];

    const foundCollections = await this.prismaService.collection.findMany({
      where: {
        slug: {
          in: slugs,
        },
      },
    });
    const existentSlugs = foundCollections.map((c) => c.slug);
    const suggestions = slugs.filter(
      (suggestedSlug) => !existentSlugs.includes(suggestedSlug),
    );
    return {
      status: false,
      suggestions,
    };
  }
}
