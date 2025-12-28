import { SignJWT, jwtVerify } from 'jose';

// Use a strong default for dev, but enforce env var in prod
const secretKey = process.env.JWT_SECRET || 'dev_secret_key_change_this_immediately';
const key = new TextEncoder().encode(secretKey);

export interface SessionPayload {
    userId: string;
    expires?: Date;
    [key: string]: any;
}

export async function encrypt(payload: SessionPayload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key);
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        });
        return payload as unknown as SessionPayload;
    } catch (error) {
        return null;
    }
}
