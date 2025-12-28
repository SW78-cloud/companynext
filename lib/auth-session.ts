import { cookies } from 'next/headers';
import { encrypt, decrypt } from './session';

export async function createSession(userId: string) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
    const sessionToken = await encrypt({ userId, expires });

    (await cookies()).set('session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: expires,
        sameSite: 'lax',
        path: '/'
    });
}

export async function deleteSession() {
    (await cookies()).delete('session');
}

export async function getSession() {
    const sessionCookie = (await cookies()).get('session');
    if (!sessionCookie) return null;
    return await decrypt(sessionCookie.value);
}
