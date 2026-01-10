import { getPosts, getCategories } from "@/lib/api";
import { PostCard } from "@/components/PostCard";
import { Newsletter } from "@/components/Newsletter";
import Link from "next/link";

export const metadata = {
  title: "Blog",
  description: "Todas as publicações do blog",
};

export default async function PostsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page) || 1;
  
  let posts: any[] = [];
  let categories: any[] = [];
  let pagination = { page: 1, totalPages: 1, hasPrev: false, hasNext: false };

  try {
    const [postsResponse, categoriesData] = await Promise.all([
      getPosts({ page, pageSize: 9 }),
      getCategories(),
    ]);

    posts = postsResponse.data;
    pagination = postsResponse.pagination;
    categories = categoriesData;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }

  return (
    <div className="animate-fade-in">
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="font-serif text-4xl font-bold text-secondary mb-4">
          Blog
        </h1>
        <p className="text-gray-600 text-lg">
          Receitas, dicas e histórias para inspirar sua mesa
        </p>
      </div>

      {/* Categories Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/posts"
            className="px-4 py-2 rounded-full bg-primary text-white font-medium"
          >
            Todas
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categoria/${category.slug}`}
              className="px-4 py-2 rounded-full bg-surface border border-gray-200 text-gray-700 hover:border-primary hover:text-primary transition-colors font-medium"
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            Nenhuma publicação encontrada.
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <nav className="flex justify-center gap-2 mt-12">
          {pagination.hasPrev && (
            <Link
              href={`/posts?page=${page - 1}`}
              className="px-4 py-2 rounded-lg bg-surface border border-gray-200 text-gray-700 hover:border-primary transition-colors"
            >
              ← Anterior
            </Link>
          )}
          
          <span className="px-4 py-2 text-gray-600">
            Página {pagination.page} de {pagination.totalPages}
          </span>

          {pagination.hasNext && (
            <Link
              href={`/posts?page=${page + 1}`}
              className="px-4 py-2 rounded-lg bg-surface border border-gray-200 text-gray-700 hover:border-primary transition-colors"
            >
              Próxima →
            </Link>
          )}
        </nav>
      )}
    </div>

    {/* Newsletter */}
    <Newsletter />
    </div>
  );
}
