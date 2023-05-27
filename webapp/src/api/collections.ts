import { api } from "../lib/api";

export interface Collection {
  name: string;
  description: string;
  slug: string;
  category: {
    slug: string;
  };
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
