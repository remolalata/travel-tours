export type TrendingDestination = {
  id: number;
  slug: string;
  name: string;
  imageSrc: string;
  tourCount: number;
};

export type Destination = {
  id: number;
  slug: string;
  name: string;
  imageSrc: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FetchDestinationsInput = {
  isActive?: boolean;
};

export type CreateDestinationInput = {
  name: string;
  slug: string;
  imageFile: File | null;
  isActive: boolean;
};

export type UpdateDestinationInput = {
  id: number;
  name: string;
  slug: string;
  imageFile: File | null;
  isActive: boolean;
  removeImage: boolean;
  currentImageSrc: string | null;
};

export type FetchTrendingDestinationsInput = {
  limit?: number;
};
