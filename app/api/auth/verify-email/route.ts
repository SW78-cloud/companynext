import { NextResponse } from 'next/server';
/** Triggering IDE re-scan... */
import prisma from '@/lib/db';
import { logAudit } from '@/lib/audit';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const token = searchParams.get('token');

    if (!userId || !token) {
        return NextResponse.json({ error: 'Missing userId or token' }, { status: 400 });
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { emailVerified: true },
        });

        // Audit Logging
        await logAudit('EMAIL_VERIFIED', 'User', userId, { emailVerified: false }, { emailVerified: true });

        return new NextResponse(`
            <html>
                <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f9fafb;">
                    <div style="text-align: center; padding: 2rem; background: white; border-radius: 0.5rem; shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);">
                        <h1 style="color: #059669;">Email Verified!</h1>
                        <p style="color: #4b5563;">You can now close this tab and return to the application.</p>
                    </div>
                </body>
            </html>
        `, {
            headers: { 'Content-Type': 'text/html' },
        });
    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
