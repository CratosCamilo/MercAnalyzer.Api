interface ScraperServiceResponse {
    nombre: string,
    precio: string,
    imagen: string,
    descripcion: string
};

declare module 'ml-scraper' {
    const scrapear: (query: string) => Promise<ScraperServiceResponse[] | null> ;
    export default scrapear;
};