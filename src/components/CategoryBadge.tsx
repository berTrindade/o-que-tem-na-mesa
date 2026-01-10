import Link from "next/link";
import { Category } from "@/lib/types";

interface CategoryBadgeProps {
  category: Category;
  small?: boolean;
  asLink?: boolean;
}

export function CategoryBadge({ category, small = false, asLink = true }: CategoryBadgeProps) {
  const className = `inline-block rounded-full font-medium transition-colors ${
    small ? "text-xs px-2 py-1" : "text-sm px-3 py-1"
  }`;

  const style = {
    backgroundColor: category.color ? `${category.color}20` : "#895b3320",
    color: category.color || "#895b33",
  };

  if (!asLink) {
    return (
      <span className={className} style={style}>
        {category.name}
      </span>
    );
  }

  return (
    <Link
      href={`/categoria/${category.slug}`}
      className={className}
      style={style}
    >
      {category.name}
    </Link>
  );
}
