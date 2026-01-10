# O Que Tem na Mesa

Um blog sobre comida, receitas e vida — powered by [Content Platform](https://github.com/yourusername/content-platform).

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- A running Content Platform API

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/o-que-tem-na-mesa.git
   cd o-que-tem-na-mesa
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your Content Platform API URL and tenant slug:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_TENANT_SLUG=wife-product
   ```

4. Start development:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 🏗 Architecture

This blog fetches all content from the Content Platform API:

```
┌─────────────────────┐     ┌──────────────────────┐
│  o-que-tem-na-mesa  │────▶│  Content Platform    │
│  (Next.js Frontend) │     │  API                 │
└─────────────────────┘     └──────────────────────┘
                                      │
                                      ▼
                            ┌──────────────────────┐
                            │  PostgreSQL Database │
                            └──────────────────────┘
```

### Key Features

- **Server-side rendering** with Next.js App Router
- **Incremental Static Regeneration (ISR)** for optimal performance
- **Dynamic theming** using tenant colors from the API
- **Responsive design** with Tailwind CSS
- **SEO optimized** with dynamic metadata

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with header/footer
│   ├── page.tsx            # Homepage
│   ├── posts/              # Blog posts
│   │   ├── page.tsx        # Posts listing
│   │   └── [slug]/page.tsx # Individual post
│   ├── categoria/[slug]/   # Category pages
│   └── [slug]/page.tsx     # Dynamic pages (about, etc.)
├── components/             # Reusable React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── PostCard.tsx
│   └── CategoryBadge.tsx
└── lib/                    # Utilities and API client
    ├── api.ts              # Content Platform API client
    ├── types.ts            # TypeScript type definitions
    └── utils.ts            # Helper functions
```

## 🎨 Customization

### Colors

Colors are automatically pulled from the tenant settings in Content Platform. You can customize them in the admin panel:

- Primary Color
- Secondary Color
- Accent Color
- Background Color
- Surface Color

### Fonts

The blog uses Google Fonts:
- **Inter** for body text
- **Playfair Display** for headings

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = Your Content Platform API URL
   - `NEXT_PUBLIC_TENANT_SLUG` = Your tenant slug

### Other Platforms

Build the production version:
```bash
npm run build
npm start
```

## 📝 License

MIT
