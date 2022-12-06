export interface BulkQuery {
    id: number;
    total: number;
    count: number;
    top: number;
    skip: number;
    queries: Array<string>;
}