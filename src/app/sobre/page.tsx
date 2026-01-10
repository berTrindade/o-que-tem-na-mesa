import { Metadata } from "next";
import Image from "next/image";
import { getTenant } from "@/lib/api";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça mais sobre o blog O que tem na mesa?",
};

export default async function SobrePage() {
  let tenant;
  try {
    tenant = await getTenant();
  } catch {
    tenant = null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
      <h1 className="font-serif text-4xl font-bold text-secondary mb-8">
        Sobre
      </h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-lg text-gray-600 leading-relaxed mb-6">
          Bem-vindo ao <strong>O que tem na mesa?</strong> Este é um espaço dedicado a compartilhar 
          receitas deliciosas, dicas culinárias e histórias sobre comida e vida.
        </p>

        <p className="text-lg text-gray-600 leading-relaxed mb-6">
          Aqui você vai encontrar desde receitas simples do dia a dia até pratos especiais 
          para ocasiões importantes. Acredito que cozinhar é um ato de amor e que a mesa 
          é onde a família e os amigos se reúnem para criar memórias.
        </p>

        <h2 className="font-serif text-2xl font-bold text-secondary mt-8 mb-4">
          Nossa Missão
        </h2>

        <p className="text-lg text-gray-600 leading-relaxed mb-6">
          Inspirar pessoas a cozinhar com prazer, usando ingredientes frescos e receitas 
          que funcionam. Queremos mostrar que fazer comida gostosa não precisa ser complicado.
        </p>

        <h2 className="font-serif text-2xl font-bold text-secondary mt-8 mb-4">
          Entre em Contato
        </h2>

        <p className="text-lg text-gray-600 leading-relaxed">
          Tem alguma sugestão de receita ou quer compartilhar sua experiência? 
          Adoraria ouvir de você! Visite nossa <a href="/contato" className="text-primary hover:text-secondary">página de contato</a>.
        </p>
      </div>
    </div>
  );
}
