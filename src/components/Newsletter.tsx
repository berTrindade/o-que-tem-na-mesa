"use client";

import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setStatus("loading");
    
    // Simulate API call - replace with your actual newsletter service
    // (e.g., Mailchimp, ConvertKit, Buttondown, etc.)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="bg-[#f5ebe3] py-16">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="mb-6">
          <span className="inline-block text-4xl mb-4">📬</span>
          <h2 className="font-serif text-3xl font-bold text-secondary mb-3">
            Receba novidades toda semana
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Inscreva-se na nossa newsletter e receba receitas, dicas e inspirações 
            diretamente no seu e-mail. Sem spam, prometemos!
          </p>
        </div>

        {status === "success" ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 animate-fade-in">
            <span className="text-2xl mb-2 block">🎉</span>
            <p className="text-green-800 font-medium">
              Obrigada por se inscrever!
            </p>
            <p className="text-green-600 text-sm mt-1">
              Você receberá nossas novidades em breve.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu melhor e-mail"
              required
              className="flex-1 px-5 py-3 rounded-full border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-center sm:text-left"
              disabled={status === "loading"}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Enviando...
                </span>
              ) : (
                "Inscrever-se"
              )}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-red-600 text-sm mt-3 animate-fade-in">
            Ops! Algo deu errado. Tente novamente.
          </p>
        )}

        <p className="text-xs text-gray-500 mt-4">
          Ao se inscrever, você concorda com nossa política de privacidade.
        </p>
      </div>
    </section>
  );
}
