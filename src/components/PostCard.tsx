import Link from "next/link";
import Image from "next/image";
import { PostWithRelations } from "@/lib/types";
import { formatDate, getReadingTime } from "@/lib/utils";

interface PostCardProps {
  post: PostWithRelations;
  featured?: boolean;
}

export function PostCard({ post, featured = false }: PostCardProps) {
  return (
    <article className={`card-hover bg-surface rounded-2xl overflow-hidden shadow-sm ${featured ? "md:col-span-2" : ""}`}>
      <Link href={`/posts/${post.slug}`}>
        {post.featuredImage && (
          <div className={`relative ${featured ? "aspect-[2/1]" : "aspect-[3/2]"}`}>
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-6">
          {/* Title */}
          <h3 className={`font-serif font-bold text-secondary mb-3 leading-snug ${featured ? "text-2xl" : "text-xl"}`}>
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {post.author && (
              <div className="flex items-center gap-2">
                {post.author.avatar && (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name || ""}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <span>{post.author.name}</span>
              </div>
            )}
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
            )}
            <span>{getReadingTime(post.content)} min de leitura</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
