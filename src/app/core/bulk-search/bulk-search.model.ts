export interface BulkSearch {
    start: string;
    id: number;
    key: string;
    count: number;
    status: number;
    finished: number;
    determined: string;
    generatingUrl: string;
    url: string;
}

export interface Summary {
    searchTerm: string;
    records: Array<Record>;
    key: string;
    count: number;
    status: number;
    finished: number;
    determined: string;
    generatingUrl: string;
    url: string;
}

export interface Record {
    id: string;
    displayName: string;
    displayCode: string;
    displayCodeName: string;
}

export interface RecordOverview {
    searchTerm?: string;
    matches?: number;
    displayName?: string;
    displayCode?: string;
    displayCodeName?: string;
}

