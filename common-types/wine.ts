/**
 * Currently a copy of Wine as of the Angular BackendService.
 * */
export type WineAsInAngular = {
    name: string;
    country: string;
    category: string;
    systembolaget: number | undefined;
};

/**
* Common definition for Wine, to be used by both frontend and backend.
* */
export type Wine = {
    name: string;
    country: string;
    category: string;
    systembolaget: number | undefined;
    volume: number | undefined;
};
