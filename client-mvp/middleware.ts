import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('split_access_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // TODO: decode jwt and verify
  // try {
  //   jwt.verify(token, process.env.JWT_SECRET!);
  //   return NextResponse.next();
  // } catch {
  //   return NextResponse.redirect(new URL('/login', req.url));
  // }
}

// Apply to selected paths
export const config = {
  matcher: ['/chat/:path*'], // Protected routes
};
