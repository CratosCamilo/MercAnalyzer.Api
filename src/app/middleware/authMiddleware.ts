import { isEmptyStrings } from "@/helpers/regex";
import { forbidden, unauthorized } from "@/helpers/response";
import { validateToken } from "@/helpers/token";
import { NextResponse } from "next/server";

export function authMiddleware(req: Request) {
    const authHeader = req.headers.get('authorization') as string;
    const refreshToken = req.headers.get('x-refresh-token') as string;

    if (isEmptyStrings([authHeader, refreshToken])) {
        return forbidden();
    }

    const requestHeaders = new Headers(req.headers);

    try {
        const token = authHeader.split(' ')[1];
        const accessToken = validateToken(token, process.env.JWT_SECRET as string);

        if (!accessToken.expired) {
            requestHeaders.set('x-user', JSON.stringify(accessToken.payload));
            return NextResponse.next({ request: { headers: requestHeaders } });
        }

        const accessRefresh = validateToken(refreshToken, process.env.JWT_REFRESH_SECRET as string);

        if (!accessRefresh.expired) {
            requestHeaders.set('x-user', JSON.stringify(accessRefresh.payload));
            return NextResponse.next({ request: { headers: requestHeaders } });
        }

        return unauthorized();
    }
    catch (error) {
        console.error('Error validating token: ', error);
        return forbidden();
    }
};