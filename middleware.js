import { NextResponse } from 'next/server'

export function middleware(request) {
  const hasAuth = request.cookies.has('sb-auth-token')
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
  const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup'

  if (isDashboard && !hasAuth) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (isAuthPage && hasAuth) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
