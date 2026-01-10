import { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPage } from "@/lib/api";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const page = await getPage(params.slug);
    return {
      title: page.metaTitle || page.title,
      description: page.metaDescription || "",
    };
  } catch {
    return { title: "Página não encontrada" };
  }
}

export default async function DynamicPage({ params }: Props) {
  let page;
  try {
    page = await getPage(params.slug);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
      <h1 className="font-serif text-4xl font-bold text-secondary mb-8">
        {page.title}
      </h1>
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {page.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
