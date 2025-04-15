import { serverError, success, unauthorized } from "@/helpers/response";
import { getUserFromPayload } from "@/helpers/session";
import { generateTokens, validateToken } from "@/helpers/token";

export async function POST(req: Request) {
    const data = await req.json();

    try {
        const accessRefresh = validateToken(data.refreshToken, process.env.JWT_REFRESH_SECRET as string);
        if (!accessRefresh.expired) return unauthorized();

        // Get user from payload.
        const userOrResponse = getUserFromPayload(accessRefresh.payload as string);
        if (userOrResponse instanceof Response) return userOrResponse;

        // Create JWT.
        const { token, refreshToken } = generateTokens(userOrResponse);
        return success({ Token: token, RefreshToken: refreshToken });
    }
    catch (error) {
        console.error('Error refresh-token endpoint: ', error);
        return serverError();
    }
}