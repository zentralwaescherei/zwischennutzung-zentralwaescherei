export type PublicationStatus = "draft" | "published";

export interface CmsImage {
  url: string;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface TextBlock {
  id: number | string;
  title: string;
  bodyRichText: string;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  styleVariant?: string | null;
  placementKey?: string | null;
}

export interface FloorArea {
  id: number | string;
  name: string;
  slug: string;
  svgZoneId: string;
  description?: string | null;
  sortOrder: number;
}

export interface Organisation {
  id: number | string;
  name: string;
  slug: string;
  shortDescription: string;
  websiteUrl: string;
  categoryTags: string[];
  floorArea: FloorArea;
  logoOrImage?: CmsImage | null;
  isFeatured: boolean;
}

export interface Testimony {
  id: number | string;
  quote: string;
  personName?: string | null;
  displayLabel?: string | null;
  roleContext?: string | null;
  portraitImage?: CmsImage | null;
  themeTags: string[];
  isApproved: boolean;
}

export interface BlogPost {
  id: number | string;
  title: string;
  slug: string;
  excerpt: string;
  bodyRichText: string;
  authorName: string;
  publishDate?: string | null;
  coverImage?: CmsImage | null;
  status: PublicationStatus;
}

export interface CmsCollectionResponse<T> {
  data: T[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface CmsItemResponse<T> {
  data: T | null;
  meta: Record<string, never>;
}
