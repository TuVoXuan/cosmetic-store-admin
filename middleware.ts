import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const cookie = request.cookies['Authorization']
  console.log('cookie: ', cookie)

  if (!cookie) {
    return NextResponse.redirect('/login')
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|images|favicon.ico).*)'
}
