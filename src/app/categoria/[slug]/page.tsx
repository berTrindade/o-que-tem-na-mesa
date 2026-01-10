import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPosts, getCategory, getCategories } from "@/lib/api";
import { PostCard } from "@/components/PostCard";
import Link from "next/link";

interface Props {
  params: { slug: string };
  searchParams: { page?: string };
}

export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return categories.map((cat) => ({ slug: cat.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const category = await getCategory(params.slug);
    return {
      title: category.name,
      description: category.description || `Posts sobre ${category.name}`,
    };
  } catch {
    return { title: "Categoria não encontrada" };
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  let category;
  try {
    category = await getCategory(params.slug);
  } catch {
    notFound();
  }

  const page = Number(searchParams.page) || 1;
  const postsResponse = await getPosts({
    categorySlug: params.slug,
    page,
    pageSize: 9,
  });
  const { data: posts, pagination } = postsResponse;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
      <div className="mb-12">
        <Link
          href="/posts"
          className="text-primary hover:text-secondary font-medium mb-4 inline-block"
        >
          ← Voltar para o blog
        </Link>
        <h1 className="font-serif text-4xl font-bold text-secondary mb-4">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-gray-600 text-lg">{category.description}</p>
        )}
      </div>

      {posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            Nenhuma publicação nesta categoria.
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <nav className="flex justify-center gap-2 mt-12">
          {pagination.hasPrev && (
            <Link
              href={`/categoria/${params.slug}?page=${page - 1}`}
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
              href={`/categoria/${params.slug}?page=${page + 1}`}
              className="px-4 py-2 rounded-lg bg-surface border border-gray-200 text-gray-700 hover:border-primary transition-colors"
            >
              Próxima →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
