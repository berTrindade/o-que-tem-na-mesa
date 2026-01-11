import {
  TenantWithSettings,
  PostWithRelations,
  Page,
  Category,
  Tag,
  NavigationItem,
  PaginatedResponse,
  ApiResponse,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG || "o-que-tem-na-mesa";

class ContentClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = "ContentClientError";
  }
}

interface FetchOptions {
  revalidate?: number | false;
  tags?: string[];
}

async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Tenant-Slug": TENANT_SLUG,
      },
      next: {
        revalidate: options.revalidate ?? 60,
        tags: options.tags,
      },
    });

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error(`API returned non-JSON response for ${endpoint}`);
      throw new ContentClientError(
        "API returned non-JSON response",
        response.status,
        "INVALID_RESPONSE"
      );
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ContentClientError(
        error.error?.message || `HTTP ${response.status}`,
        response.status,
        error.error?.code
      );
    }

    const data: ApiResponse<T> = await response.json();

    if (!data.success) {
      throw new ContentClientError(
        data.error?.message || "Request failed",
        400,
        data.error?.code
      );
    }

    return data.data as T;
  } catch (error) {
    if (error instanceof ContentClientError) {
      throw error;
    }
    console.error(`Failed to fetch data:`, error);
    throw new ContentClientError(
      "Failed to connect to API",
      503,
      "API_UNAVAILABLE"
    );
  }
}

// ============================================
// TENANT
// ============================================

export async function getTenant(): Promise<TenantWithSettings> {
  return fetchAPI<TenantWithSettings>("/tenant", {
    revalidate: 3600,
    tags: ["tenant"],
  });
}

// ============================================
// POSTS
// ============================================

export async function getPosts(params?: {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  tagSlug?: string;
  featured?: boolean;
  search?: string;
}): Promise<PaginatedResponse<PostWithRelations>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.pageSize) searchParams.set("pageSize", String(params.pageSize));
  if (params?.categorySlug) searchParams.set("categorySlug", params.categorySlug);
  if (params?.tagSlug) searchParams.set("tagSlug", params.tagSlug);
  if (params?.featured !== undefined) searchParams.set("featured", String(params.featured));
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return fetchAPI<PaginatedResponse<PostWithRelations>>(
    `/posts${query ? `?${query}` : ""}`,
    { revalidate: 0, tags: ["posts"] }
  );
}

export async function getPost(slug: string): Promise<PostWithRelations> {
  return fetchAPI<PostWithRelations>(`/posts/${slug}`, {
    revalidate: 0,
    tags: ["posts", `post-${slug}`],
  });
}

/**
 * Get a post with draft support.
 * When Draft Mode is enabled, this will fetch from /draft/posts/[slug]
 * which returns posts regardless of their publication status.
 */
export async function getPostWithDraft(
  slug: string,
  isDraftMode: boolean
): Promise<PostWithRelations & { _preview?: boolean; _isDraft?: boolean }> {
  const endpoint = isDraftMode ? `/draft/posts/${slug}` : `/posts/${slug}`;
  
  return fetchAPI<PostWithRelations & { _preview?: boolean; _isDraft?: boolean }>(
    endpoint,
    {
      // Don't cache in draft mode
      revalidate: isDraftMode ? 0 : 60,
      tags: isDraftMode ? [] : ["posts", `post-${slug}`],
    }
  );
}

export async function getPostSlugs(): Promise<string[]> {
  try {
    return await fetchAPI<string[]>("/posts/slugs", {
      revalidate: 60,
      tags: ["posts"],
    });
  } catch {
    // Return empty array if API is unavailable (allows build to complete)
    return [];
  }
}

export async function getFeaturedPosts(): Promise<PostWithRelations[]> {
  const response = await getPosts({ featured: true, pageSize: 10 });
  return response.data;
}

// ============================================
// PAGES
// ============================================

export async function getPages(): Promise<Page[]> {
  const response = await fetchAPI<PaginatedResponse<Page>>("/pages", {
    revalidate: 3600,
    tags: ["pages"],
  });
  return response.data;
}

export async function getPage(slug: string): Promise<Page> {
  return fetchAPI<Page>(`/pages/${slug}`, {
    revalidate: 3600,
    tags: ["pages", `page-${slug}`],
  });
}

// ============================================
// CATEGORIES & TAGS
// ============================================

export async function getCategories(): Promise<Category[]> {
  return fetchAPI<Category[]>("/categories", {
    revalidate: 3600,
    tags: ["categories"],
  });
}

export async function getCategory(slug: string): Promise<Category> {
  return fetchAPI<Category>(`/categories/${slug}`, {
    revalidate: 3600,
    tags: ["categories", `category-${slug}`],
  });
}

export async function getTags(): Promise<Tag[]> {
  return fetchAPI<Tag[]>("/tags", {
    revalidate: 3600,
    tags: ["tags"],
  });
}

// ============================================
// NAVIGATION
// ============================================

export async function getNavigation(): Promise<NavigationItem[]> {
  return fetchAPI<NavigationItem[]>("/navigation", {
    revalidate: 3600,
    tags: ["navigation"],
  });
}

// ============================================
// SEARCH
// ============================================

export async function search(query: string): Promise<PostWithRelations[]> {
  const response = await fetchAPI<{ posts: PostWithRelations[] }>(
    `/search?q=${encodeURIComponent(query)}`,
    { revalidate: 0 }
  );
  return response.posts;
}
