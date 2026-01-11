import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPost, getPostWithDraft, getPostSlugs, getPosts } from "@/lib/api";
import { formatDate, getReadingTime } from "@/lib/utils";
import { CategoryBadge } from "@/components/CategoryBadge";
import { PostCard } from "@/components/PostCard";
import { Newsletter } from "@/components/Newsletter";
import { ShareButtons } from "@/components/ShareButtons";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    const slugs = await getPostSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await getPost(params.slug);
    return {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || "",
      openGraph: {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt || "",
        images: post.ogImage || post.featuredImage ? [post.ogImage || post.featuredImage!] : [],
        type: "article",
        publishedTime: post.publishedAt || undefined,
      },
    };
  } catch {
    return { title: "Post não encontrado" };
  }
}

export default async function PostPage({ params }: Props) {
  // Check if Draft Mode is enabled
  const draft = await draftMode();
  const isDraftMode = draft.isEnabled;

  let post;
  try {
    post = await getPostWithDraft(params.slug, isDraftMode);
  } catch (error) {
    console.error("Failed to fetch post:", error);
    notFound();
  }

  if (!post) {
    notFound();
  }

  const isDraft = post._isDraft || post.status !== "PUBLISHED";

  // Get related posts (same category)
  let relatedPosts: typeof post[] = [];
  if (post.categories && post.categories.length > 0) {
    try {
      const response = await getPosts({
        categorySlug: post.categories[0].slug,
        pageSize: 3,
      });
      relatedPosts = response.data.filter((p) => p.id !== post.id).slice(0, 2);
    } catch {
      // Ignore errors
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Draft Mode Banner */}
      {isDraftMode && (
        <div className="bg-amber-500 text-amber-950 text-center py-3 px-4 sticky top-0 z-50">
          <div className="flex items-center justify-center gap-4">
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-950 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-950" />
              </span>
              <strong>Modo Preview</strong>
              {isDraft && <span className="text-sm">(Rascunho)</span>}
            </span>
            <a
              href="/api/draft/disable?redirect=/"
              className="bg-amber-950 text-amber-100 px-4 py-1 rounded-full text-sm font-medium hover:bg-amber-900 transition-colors"
            >
              Sair do Preview
            </a>
          </div>
        </div>
      )}
    <article>
      {/* Hero */}
      <header className="bg-surface">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex gap-2 mb-6">
              {post.categories.map((cat) => (
                <CategoryBadge key={cat.id} category={cat} />
              ))}
            </div>
          )}

          <h1 className="font-serif text-4xl md:text-5xl font-bold text-secondary mb-6 leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-gray-500">
            {post.author && (
              <div className="flex items-center gap-3">
                {post.author.avatar && (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name || ""}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                )}
                <div>
                  <div className="font-medium text-gray-800">
                    {post.author.name}
                  </div>
                  {post.author.bio && (
                    <div className="text-sm">{post.author.bio}</div>
                  )}
                </div>
              </div>
            )}
            <div className="flex items-center gap-4 text-sm">
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
              )}
              <span>•</span>
              <span>{getReadingTime(post.content)} min de leitura</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="max-w-5xl mx-auto px-4 pb-12">
            <div className="relative aspect-[2/1] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <div className="bg-surface max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm hover:bg-primary hover:text-white transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Share Buttons */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <ShareButtons 
            title={post.title} 
            slug={params.slug} 
            image={post.ogImage || post.featuredImage || undefined}
          />
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-surface py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="font-serif text-2xl font-bold text-secondary mb-8">
              Você também pode gostar
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>

    {/* Newsletter */}
    <Newsletter />
    </div>
  );
}
