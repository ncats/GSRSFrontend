export interface PagingResponse<T> {
    id: number;
    version: number;
    created: number;
    etag: string;
    path: string;
    uri: string;
    nextPageUri: string;
    method: string;
    sha1: string;
    total: number;
    count: number;
    skip: number;
    top: number;
    query: string;
    content: Array<T>;
    facets: Array<any>;
}
