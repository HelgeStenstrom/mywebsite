export type SqlWrapper = {
    query: (sql: string, values?: any) => Promise<any>,
    end: () => Promise<void>
};