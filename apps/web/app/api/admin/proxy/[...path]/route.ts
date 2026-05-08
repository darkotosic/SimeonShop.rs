import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const apiBaseUrl = (process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000').replace(/\/$/, '');
const blockedHeaders = new Set(['host', 'connection', 'content-length', 'cookie']);

type Context = { params: Promise<{ path?: string[] }> };

async function proxy(request: NextRequest, context: Context) {
  const { path = [] } = await context.params;
  const upstreamPath = `/${path.join('/')}`;
  if (!upstreamPath.startsWith('/api/v1/admin')) {
    return NextResponse.json({ detail: 'Admin proxy only allows /api/v1/admin paths.' }, { status: 403 });
  }

  const token = (await cookies()).get('simeonshop_admin_token')?.value;
  if (!token) return NextResponse.json({ detail: 'Admin session is missing.' }, { status: 401 });

  const headers = new Headers();
  request.headers.forEach((value, key) => { if (!blockedHeaders.has(key.toLowerCase())) headers.set(key, value); });
  headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type') && request.method !== 'GET' && request.method !== 'HEAD') headers.set('Content-Type', 'application/json');

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
  const body = hasBody ? await request.arrayBuffer() : undefined;

  const response = await fetch(`${apiBaseUrl}${upstreamPath}${request.nextUrl.search}`, {
    method: request.method,
    headers,
    body,
    cache: 'no-store',
  });

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete('content-encoding');
  responseHeaders.delete('content-length');
  return new NextResponse(response.body, { status: response.status, headers: responseHeaders });
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const PUT = proxy;
export const DELETE = proxy;
