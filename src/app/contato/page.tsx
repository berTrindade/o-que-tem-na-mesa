import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato",
  description: "Entre em contato conosco",
};

export default function ContatoPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
      <h1 className="font-serif text-4xl font-bold text-secondary mb-8">
        Contato
      </h1>

      <p className="text-lg text-gray-600 mb-8">
        Tem alguma dúvida, sugestão ou quer bater um papo? Adoraria ouvir de você!
      </p>

      <form className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nome
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            placeholder="Seu nome"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Assunto
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            placeholder="Sobre o que você quer falar?"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Mensagem
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
            placeholder="Escreva sua mensagem aqui..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-secondary transition-colors"
        >
          Enviar Mensagem
        </button>
      </form>
    </div>
  );
}
