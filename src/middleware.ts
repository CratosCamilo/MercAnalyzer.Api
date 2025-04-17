// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { corsMiddleware } from './middleware/corsMiddleware';

export function middleware(req: NextRequest) {
  let res = NextResponse.next();
  res = corsMiddleware(req, res);
  return res;
}