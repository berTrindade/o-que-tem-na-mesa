import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Force Node.js runtime (required for crypto module)
export const runtime = "nodejs";

// Validate the preview token
function validatePreviewToken(
  token: string,
  maxAge: number = 3600000 // 1 hour default
): { valid: boolean; postId?: string; slug?: string; error?: string } {
  try {
    const secret = process.env.PREVIEW_SECRET || "default-preview-secret";
    
    // Decode the base64url token
    const decoded = Buffer.from(token, "base64url").toString();
    const parts = decoded.split(":");
    
    if (parts.length !== 4) {
      return { valid: false, error: "Invalid token format" };
    }

    const [postId, slug, timestampStr, signature] = parts;
    const timestamp = parseInt(timestampStr, 10);
    
    // Check if token has expired
    if (Date.now() - timestamp > maxAge) {
      return { valid: false, error: "Token expired" };
    }

    // Verify signature
    const data = `${postId}:${slug}:${timestamp}`;
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(data);
    const expectedSignature = hmac.digest("hex").substring(0, 16);

    if (signature !== expectedSignature) {
      return { valid: false, error: "Invalid signature" };
    }

    return { valid: true, postId, slug };
  } catch (error) {
    return { valid: false, error: "Token validation failed" };
  }
}

/**
 * GET /api/draft/enable
 * 
 * Enables Next.js Draft Mode and redirects to the content page.
 * Called from the CMS admin panel's "Preview" button.
 * 
 * Query parameters:
 * - secret: The preview token (required)
 * - slug: The content slug to preview (required)
 * - type: Content type - "post" or "page" (default: "post")
 * 
 * IMPORTANT: The PREVIEW_SECRET environment variable must match
 * the one used in the admin-ui (content-platform) for token generation.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");
  const type = searchParams.get("type") || "post";

  // Validate required parameters
  if (!secret) {
    return new NextResponse(
      renderErrorPage("Parâmetro ausente", "O parâmetro 'secret' é obrigatório."),
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }

  if (!slug) {
    return new NextResponse(
      renderErrorPage("Parâmetro ausente", "O parâmetro 'slug' é obrigatório."),
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }

  // Validate the token
  const validation = validatePreviewToken(secret);
  
  if (!validation.valid) {
    console.error("Draft mode token validation failed:", validation.error);
    return new NextResponse(
      renderErrorPage(
        "Token inválido",
        validation.error === "Token expired" 
          ? "O link de preview expirou. Gere um novo link no painel de controle."
          : "O token de preview é inválido. Verifique se a variável PREVIEW_SECRET está configurada corretamente."
      ),
      { status: 401, headers: { "Content-Type": "text/html" } }
    );
  }

  // Verify the slug matches the token
  if (validation.slug !== slug) {
    return new NextResponse(
      renderErrorPage("Slug incompatível", "O slug do token não corresponde ao slug solicitado."),
      { status: 401, headers: { "Content-Type": "text/html" } }
    );
  }

  // Enable Draft Mode
  const draft = await draftMode();
  draft.enable();

  // Construct the redirect URL based on content type
  const redirectPath = type === "page" ? `/${slug}` : `/posts/${slug}`;
  const redirectUrl = new URL(redirectPath, request.nextUrl.origin);

  return NextResponse.redirect(redirectUrl);
}

function renderErrorPage(title: string, message: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Erro de Preview - ${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      padding: 1rem;
    }
    .card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      max-width: 400px;
      text-align: center;
    }
    .icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 1rem;
      background: #fef3c7;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
    }
    h1 {
      color: #92400e;
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }
    p {
      color: #78716c;
      line-height: 1.6;
    }
    a {
      display: inline-block;
      margin-top: 1.5rem;
      padding: 0.75rem 1.5rem;
      background: #f59e0b;
      color: white;
      text-decoration: none;
      border-radius: 0.5rem;
      font-weight: 500;
      transition: background 0.2s;
    }
    a:hover { background: #d97706; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">⚠️</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="/">Voltar para a página inicial</a>
  </div>
</body>
</html>
  `.trim();
}
