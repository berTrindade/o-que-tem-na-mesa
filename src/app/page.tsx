import Link from "next/link";
import Image from "next/image";
import { getPosts, getFeaturedPosts } from "@/lib/api";
import { PostCard } from "@/components/PostCard";
import { Newsletter } from "@/components/Newsletter";

export default async function HomePage() {
  let posts: any[] = [];
  let heroPost: any = null;
  let otherPosts: any[] = [];

  try {
    const [postsResponse, featuredPosts] = await Promise.all([
      getPosts({ pageSize: 6 }),
      getFeaturedPosts(),
    ]);

    posts = postsResponse.data;
    heroPost = featuredPosts[0] || posts[0];
    // Show up to 3 posts, excluding the hero post if there are enough posts
    const postsWithoutHero = posts.filter((p) => p.id !== heroPost?.id);
    otherPosts = postsWithoutHero.length >= 3 
      ? postsWithoutHero.slice(0, 3) 
      : posts.slice(0, 3);
  } catch (error) {
    // API unavailable - show empty state
    console.error("Failed to fetch data:", error);
  }

  // Show fallback if API is unavailable
  if (!heroPost && posts.length === 0) {
    return (
      <div className="animate-fade-in">
        <section className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-secondary mb-6">
            O que tem na mesa?
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Um espaço para compartilhar receitas, dicas e histórias sobre comida e vida.
          </p>
          <p className="text-gray-500">
            Conteúdo em breve...
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      {heroPost && (
        <section className="relative bg-surface">
          <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1">
                <h1 className="font-serif text-4xl lg:text-5xl font-bold text-secondary mb-4 leading-tight">
                  {heroPost.title}
                </h1>
                {heroPost.excerpt && (
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {heroPost.excerpt}
                  </p>
                )}
                <Link
                  href={`/posts/${heroPost.slug}`}
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-secondary transition-colors"
                >
                  Ler mais
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
              <div className="order-1 lg:order-2">
                {heroPost.featuredImage && (
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src={heroPost.featuredImage}
                      alt={heroPost.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl font-bold text-secondary">
            Últimas Publicações
          </h2>
          <Link
            href="/posts"
            className="text-primary hover:text-secondary font-medium"
          >
            Ver todas →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}
