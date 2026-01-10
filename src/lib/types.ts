// ============================================
// API TYPES (from content-platform)
// ============================================

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  logo?: string | null;
  favicon?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
  backgroundColor?: string | null;
  surfaceColor?: string | null;
  customDomain?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TenantSettings {
  id: string;
  tenantId: string;
  siteTitle?: string | null;
  siteDescription?: string | null;
  ogImage?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  linkedin?: string | null;
  github?: string | null;
  youtube?: string | null;
  enableComments: boolean;
  enableNewsletter: boolean;
  enableSearch: boolean;
  googleAnalyticsId?: string | null;
}

export interface TenantWithSettings extends Tenant {
  settings?: TenantSettings | null;
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  bio?: string | null;
}

export type PostStatus = "DRAFT" | "REVIEW" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";

export interface Post {
  id: string;
  tenantId: string;
  authorId: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  contentHtml?: string | null;
  featuredImage?: string | null;
  ogImage?: string | null;
  status: PostStatus;
  publishedAt?: string | null;
  scheduledAt?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  featured: boolean;
  featuredOrder?: number | null;
  allowComments: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostWithRelations extends Post {
  author?: User;
  categories?: Category[];
  tags?: Tag[];
}

export interface Page {
  id: string;
  tenantId: string;
  title: string;
  slug: string;
  content: string;
  contentHtml?: string | null;
  template: string;
  showInNav: boolean;
  navOrder: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description?: string | null;
  color?: string | null;
  order: number;
}

export interface Tag {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
}

export interface NavigationItem {
  id: string;
  tenantId: string;
  label: string;
  url: string;
  order: number;
  openInNewTab: boolean;
  parentId?: string | null;
  children?: NavigationItem[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
