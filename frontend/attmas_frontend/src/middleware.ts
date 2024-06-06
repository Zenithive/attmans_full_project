import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Log to check if middleware is being executed
  console.log("Middleware executed");

  // Check if the user is authenticated
  const isAuthenticated = checkAuth(request);

  // If the user is not authenticated, redirect them to the login page
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow the request to proceed if the user is authenticated
  //return NextResponse.next();
}

function checkAuth(request: NextRequest): boolean {
  // Get the access_token from the cookies
  const token = request.cookies.get('access_token');
  console.log("token", token);
  // Check if the token exists
  return token ? true : false;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard', '/freelancers', '/innovators', '/industries', '/exhibition','/profile','/jobs'],
};
