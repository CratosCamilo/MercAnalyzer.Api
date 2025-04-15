import scrapear from "ml-scraper";

export async function ScraperService(query: string): Promise<ScraperServiceResponse[] | null> {
    try {
        const results = await scrapear(query) as ScraperServiceResponse[];
        return results;
    }
    catch (error) {
        console.error('Error in ScraperService:', error);
        throw error;
    }
};