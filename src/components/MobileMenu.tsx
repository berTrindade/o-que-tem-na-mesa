"use client";

import { useState } from "react";
import Link from "next/link";

interface MobileMenuProps {
  extraNavigation?: Array<{ id: string; label: string; url: string; openInNewTab: boolean }>;
}

export function MobileMenu({ extraNavigation = [] }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="md:hidden p-2 text-gray-600 border border-gray-200 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile menu panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-64 bg-[#f5ebe3] shadow-xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <button 
            className="absolute top-4 right-4 p-2 text-gray-600"
            onClick={() => setIsOpen(false)}
            aria-label="Fechar menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <nav className="mt-8 flex flex-col gap-4">
            <Link
              href="/"
              className="text-lg text-gray-700 hover:text-primary transition-colors font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Início
            </Link>
            <Link
              href="/posts"
              className="text-lg text-gray-700 hover:text-primary transition-colors font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/sobre"
              className="text-lg text-gray-700 hover:text-primary transition-colors font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Sobre
            </Link>
            <Link
              href="/contato"
              className="text-lg text-gray-700 hover:text-primary transition-colors font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Contato
            </Link>
            {extraNavigation.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className="text-lg text-gray-700 hover:text-primary transition-colors font-medium py-2"
                target={item.openInNewTab ? "_blank" : undefined}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
