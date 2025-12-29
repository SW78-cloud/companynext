import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth-session';

export async function POST() {
    await deleteSession();
    return NextResponse.json({ success: true });
}

export async function GET(request: Request) {
    await deleteSession();
    // Redirect to home or login after clearing session
    return NextResponse.redirect(new URL('/', request.url));
}
