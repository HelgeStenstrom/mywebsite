export type SqlWrapper = {
    query: (sql: string) => Promise<any>,
    end: () => Promise<void>
};