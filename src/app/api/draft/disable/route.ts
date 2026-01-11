import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/draft/disable
 * 
 * Disables Next.js Draft Mode and optionally redirects.
 * 
 * Query parameters:
 * - redirect: URL to redirect to after disabling (optional, default: /)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const redirectTo = searchParams.get("redirect") || "/";

  // Disable Draft Mode
  const draft = await draftMode();
  draft.disable();

  // Redirect to the specified URL (validate it's on the same origin)
  const redirectUrl = new URL(redirectTo, request.nextUrl.origin);
  
  // Only allow redirects to the same origin
  if (redirectUrl.origin === request.nextUrl.origin) {
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.redirect(new URL("/", request.nextUrl.origin));
}

/**
 * POST /api/draft/disable
 * 
 * Alternative POST endpoint for disabling draft mode.
 */
export async function POST() {
  const draft = await draftMode();
  draft.disable();

  return NextResponse.json({
    success: true,
    message: "Draft mode disabled",
  });
}
