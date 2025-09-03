import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, req) => {
  // Define public routes that don't require authentication
  const isPublicRoute = createRouteMatcher([
    '/', 
    '/about(.*)',
    '/contact(.*)',
    '/api/public(.*)',
    '/api/create'
  ]);

  // Check if the current route is not public
  if (!isPublicRoute(req)) {
    // Protect all routes that aren't public
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|.*\\.(?:jpg|jpeg|gif|png|webp|svg|ico|css|js|woff2?|map)$).*)',
    // Match all API routes
    '/api/(.*)'
  ]
};