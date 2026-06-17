export type CmsJsonValue =
  | string
  | number
  | boolean
  | null
  | CmsJsonValue[]
  | { [key: string]: CmsJsonValue };

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
  categoryTags?: CmsJsonValue | null;
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
  themeTags?: CmsJsonValue | null;
  isApproved: boolean;
  isAnonymous?: boolean | null;
  personRole?: string | null;
  organisation?: Organisation | null;
  sortOrder?: number | null;
}

export interface BlogPost {
  id: number | string;
  title: string;
  slug: string;
  excerpt: string;
  bodyRichText: string;
  authorName: string;
  publishDate?: string | null;
  publishedAt?: string | null;
  coverImage?: CmsImage | null;
}

/** Strapi-style: only entries with `publishedAt` are public (draft has null). */
export function filterPublishedPosts(posts: BlogPost[]): BlogPost[] {
  return posts.filter((post) => post.publishedAt != null && String(post.publishedAt).length > 0);
}

export function getPublishedPostBySlug(posts: BlogPost[], slug: string): BlogPost | undefined {
  return filterPublishedPosts(posts).find((post) => post.slug === slug);
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
