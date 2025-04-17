import { ER_MESSAGES } from "@/constants/constants";
import { badRequest, serverError, success } from "@/helpers/response";
import { getUserSession } from "@/helpers/session";
import { HistoryRepository } from "@/lib/repositories/HistoryRepository";
import { UserRepository } from "@/lib/repositories/UserRepository";
import { ScraperService } from "@/lib/services/ml-scraper/scraperService";
import { authMiddleware } from "@/middleware/authMiddleware";
import { SearchProps, UserProps } from "@/types/props";
import { validateSearch } from "@/validators/validateSearch";

export async function POST(req: Request) {
    const authResponse = authMiddleware(req);
    if (authResponse instanceof Response) return authResponse;

    const userOrResponse = getUserSession(req);
    if (userOrResponse instanceof Response) return userOrResponse;

    const data: SearchProps = await req.json();
    const validatorResponse = validateSearch(data);
    if (validatorResponse instanceof Response) return validatorResponse;

    try {
        const { filter }: SearchProps = data;
        const { userId }: UserProps = userOrResponse;

        // User ID validation.
        const existsUser = UserRepository.findById(userId);
        if (!existsUser) return badRequest(ER_MESSAGES.USER_NOT_EXISTS);

        // Scraper.
        const response = await ScraperService(filter);
        if (!response) return badRequest(ER_MESSAGES.SCRAPER_ERROR);

        // Save search.
        await HistoryRepository.save(userId, filter, JSON.stringify(response));
        return success(response);
    }
    catch (error) {
        console.error('Error search endpoint: ', error);
        return serverError();
    }
};