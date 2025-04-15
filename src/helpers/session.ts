import { UserProps } from "@/types/props";
import { forbidden } from "./response";

export function getUserSession(req: Request) {
    const userHeader = req.headers.get("x-user") as string;
    if (!userHeader) {
        console.warn('Missing x-user header');
        return forbidden();
    }

    try {
        const user = JSON.parse(userHeader) as UserProps;
        if (!user?.userId || !user?.email) return forbidden();

        return user;
    }
    catch (error) {
        console.error('Error parsing x-user header: ', error);
        return forbidden();
    }
};