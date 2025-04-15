import { UserProps } from '@/types/props';
import jwt, { SignOptions } from 'jsonwebtoken';
import { isEmptyStrings } from './regex';

export function generateTokens({ userId, email }: UserProps) {
    const secret = process.env.JWT_SECRET as string;
    const expiresIn = process.env.JWT_EXPIRATION as string;

    if (isEmptyStrings([secret, expiresIn])) {
        throw new Error('JWT_SECRET y JWT_EXPIRATION deben estar definidos en el .env');
    }

    const payload = { userId: userId, email: email };
    const options = { expiresIn } as unknown as SignOptions;

    const token = jwt.sign(payload, secret, options);
    const refreshToken = generateRefreshToken();
    return { token, refreshToken };
};

export function generateRefreshToken() {
    const secret = process.env.JWT_REFRESH_SECRET as string;
    const expiresIn = process.env.JWT_REFRESH_EXPIRATION as string;

    if (isEmptyStrings([secret, expiresIn])) {
        throw new Error('JWT_REFRESH_SECRET y JWT_REFRESH_EXPIRATION deben estar definidos en el .env');
    }

    const options = { expiresIn } as unknown as SignOptions;
    const token = jwt.sign({}, secret, options);
    return token;
};

export function validateToken(token: string, secretKey: string) {
    try {
        const decoded = jwt.verify(token, secretKey);
        return { payload: decoded, expired: false };
    }
    catch (error) {
        console.error('JWT expired: ', error);
        return { payload: null, expired: true };
    }
};