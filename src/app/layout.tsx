import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getTenant } from "@/lib/api";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export async function generateMetadata(): Promise<Metadata> {
  const siteName = "O que tem na mesa?";
  try {
    const tenant = await getTenant();
    return {
      title: {
        default: siteName,
        template: `%s | ${siteName}`,
      },
      description: tenant.settings?.siteDescription || tenant.description || "Um blog sobre comida, receitas e vida",
      openGraph: {
        title: siteName,
        description: tenant.settings?.siteDescription || tenant.description || "Um blog sobre comida, receitas e vida",
        images: tenant.settings?.ogImage ? [tenant.settings.ogImage] : [],
      },
    };
  } catch {
    return {
      title: siteName,
      description: "Um blog sobre comida, receitas e vida",
    };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let tenant;
  try {
    tenant = await getTenant();
  } catch {
    tenant = null;
  }

  // Apply fixed brand colors as CSS variables
  // These are the official brand colors that should always be used
  const style = {
    "--color-primary": "#895b33",      // terracotta/orange - links, buttons
    "--color-secondary": "#46594c",    // green - headings
    "--color-accent": "#6e482f",       // brown - highlight elements
    "--color-background": "#ffffff",
    "--color-surface": "#ffffff",
  };

  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen flex flex-col`}
        // @ts-expect-error - CSS custom properties
        style={style}
      >
        <Header tenant={tenant} />
        <main className="flex-1">{children}</main>
        <Footer tenant={tenant} />
      </body>
    </html>
  );
}
