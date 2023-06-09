import { api } from "../lib/api";
import { Page } from "./utils";

export interface Collection {
  name: string;
  description: string;
  slug: string;
  category: {
    slug: string;
  };
  logoImageSrc?: string;
  coverImageSrc?: string;
  featuredImageSrc?: string;
  contractAddress: string;
  publishStatus: string;
  ownerId: string;
}

export interface AllowlistDto {
  address: string;
}

export interface MintStageDto {
  name: string;
  price: string;
  type: "ALLOWLIST" | "PUBLIC";
  startDate: string;
  endDate: string;
  allowlistData: AllowlistDto[];
}

export interface MintStageGroupDto {
  mintStages: MintStageDto[];
}

export interface CreateMintStageGroupResponseDto {
  mintStageGroupId: string;
  merkleTreeRoots: string[];
}

export interface RevealedTokenDto {
  tokenId: number;
  address: string;
  name?: string;
  imageUrl?: string;
  metadataJson?: string;
}

export interface PublishStatusDto {
  status: "DRAFT" | "PUBLISHED";
}

export interface CheckSlugAvailabilityResponseDto {
  status: boolean;
  suggestions: string[];
}

export const getCollection = async (
  slug: string
): Promise<Collection | null> => {
  try {
    const { data } = await api.get(`/collections/${slug}`);
    return data;
  } catch (error) {
    return null;
  }
};

export const getCollections = async (
  page: Page,
  filter: { owner?: string; publishStatus?: string[] } = {}
): Promise<Collection[] | null> => {
  try {
    const { data } = await api.get("/collections", {
      params: {
        ...page,
        ...filter,
      },
    });
    return data;
  } catch (error) {
    return null;
  }
};

export const createCollection = async (input: {
  name: string;
  description: string;
  slug: string;
  categorySlug: string;
  contractAddress: string;
}): Promise<Collection> => {
  const { data } = await api.post("/collections", input);
  return data;
};

export const updateCollection = async (
  slug: string,
  input: {
    name: string;
    description: string;
    slug: string;
    categorySlug: string;
  }
): Promise<Collection> => {
  const { data } = await api.patch(`/collections/${slug}`, input);
  return data;
};

export const updateCollectionGraphics = async (
  slug: string,
  formData: FormData
): Promise<Collection> => {
  const { data } = await api.post(`/collections/${slug}/graphics`, formData);
  return data;
};

export const uploadCollectionFile = async (
  slug: string,
  formData: FormData
): Promise<{ url: string; mimetype: string }> => {
  const { data } = await api.post(`/collections/${slug}/upload`, formData);
  return data;
};

export const createMintStageGroup = async (
  slug: string,
  mintStageGroupDto: MintStageGroupDto
): Promise<CreateMintStageGroupResponseDto> => {
  const { data } = await api.post(
    `/collections/${slug}/mintstage-groups`,
    mintStageGroupDto
  );
  return data;
};

export const activateMintStageGroup = async (
  slug: string,
  mintStageGroupId: string
): Promise<{ status: boolean }> => {
  const { data } = await api.post(
    `/collections/${slug}/mintstage-groups/${mintStageGroupId}/activate`
  );
  return data;
};

export const getMintProof = async (
  slug: string,
  address: string
): Promise<{ proof: string[]; eligible: boolean }> => {
  const { data } = await api.get(`/collections/${slug}/mint-proof/${address}`);
  return data;
};

export const getActiveMintStageGroup = async (
  slug: string
): Promise<MintStageGroupDto | null> => {
  try {
    const { data } = await api.get(
      `/collections/${slug}/mintstage-groups/active`
    );
    return data;
  } catch (error) {
    return null;
  }
};

export const createRevealedToken = async (
  slug: string,
  revealedTokenDto: RevealedTokenDto
): Promise<RevealedTokenDto | null> => {
  try {
    const { data } = await api.post(
      `/collections/${slug}/revealed-tokens`,
      revealedTokenDto
    );
    return data;
  } catch (error) {
    return null;
  }
};

export const getRevealedTokens = async (
  slug: string,
  page: Page
): Promise<RevealedTokenDto[]> => {
  try {
    const { data } = await api.get(`/collections/${slug}/revealed-tokens`, {
      params: {
        ...page,
      },
    });
    return data;
  } catch (error) {
    return [];
  }
};

export const setPublishStatus = async (
  slug: string,
  publishStatusDto: PublishStatusDto
): Promise<PublishStatusDto | null> => {
  try {
    const { data } = await api.post(
      `/collections/${slug}/publish-status`,
      publishStatusDto
    );
    return data;
  } catch (error) {
    return null;
  }
};

export const getSlugAvailability = async (
  slug: string
): Promise<CheckSlugAvailabilityResponseDto> => {
  const { data } = await api.get(`/collections/${slug}/availability`);
  return data;
};
