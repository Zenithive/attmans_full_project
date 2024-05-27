import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Log to check if middleware is being executed
  console.log("Middleware executed");

 
  const isAuthenticated = checkAuth(request);

  // If the user is not authenticated, redirect them to the home page
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow the request to proceed if the user is authenticated
  return NextResponse.next();
}


function checkAuth(request: NextRequest): boolean {
  const token = request.cookies.get('auth-token');
  return token ? true : false;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard', '/freelancers', '/innovators', '/industries' ],
}
