import Link from "next/link";
import { TenantWithSettings } from "@/lib/types";
import { getNavigation } from "@/lib/api";
import { MobileMenu } from "./MobileMenu";

interface HeaderProps {
  tenant: TenantWithSettings | null;
}

export async function Header({ tenant }: HeaderProps) {
  let navigation: Array<{ id: string; label: string; url: string; openInNewTab: boolean }> = [];
  try {
    navigation = await getNavigation();
  } catch {
    navigation = [];
  }

  // Filter out duplicates - skip Home/Blog/Sobre/Contact since we have hardcoded links
  const filteredNavigation = navigation.filter((item) => {
    const url = item.url.toLowerCase();
    const label = item.label.toLowerCase();
    // Skip if it's a duplicate of our hardcoded links
    if (url === "/" || url === "/posts" || url === "/blog" || url === "/contact" || url === "/contato" || url === "/sobre" || url === "/about") {
      return false;
    }
    if (label === "home" || label === "blog" || label === "início" || label === "inicio" || label === "contact" || label === "contato" || label === "sobre" || label === "about") {
      return false;
    }
    return true;
  });

  return (
    <header className="bg-[#f5ebe3] border-b border-[#ebddd0] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            {tenant?.logo ? (
              <img
                src={tenant.logo}
                alt="O que tem na mesa?"
                className="h-10 w-auto"
              />
            ) : (
              <span className="font-serif text-2xl font-bold text-secondary">
                O que tem na mesa?
              </span>
            )}
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-primary transition-colors font-medium"
            >
              Início
            </Link>
            <Link
              href="/posts"
              className="text-gray-600 hover:text-primary transition-colors font-medium"
            >
              Blog
            </Link>
            <Link
              href="/sobre"
              className="text-gray-600 hover:text-primary transition-colors font-medium"
            >
              Sobre
            </Link>
            <Link
              href="/contato"
              className="text-gray-600 hover:text-primary transition-colors font-medium"
            >
              Contato
            </Link>
            {filteredNavigation.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className="text-gray-600 hover:text-primary transition-colors font-medium"
                target={item.openInNewTab ? "_blank" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu */}
          <MobileMenu extraNavigation={filteredNavigation} />
        </div>
      </div>
    </header>
  );
}
