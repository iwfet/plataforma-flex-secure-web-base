
/**
 * Check if a route is public (doesn't require authentication)
 */
export const isPublicRoute = (path: string): boolean => {
  // Extract the base path without query parameters or hash
  const basePath = path.split('?')[0].split('#')[0];

  return [
    "/",
    "/login",
    "/forgot-password",
    "/reset-password",
  ].some(route =>
    basePath === route || basePath.startsWith("/reset-password/")
  );
};

