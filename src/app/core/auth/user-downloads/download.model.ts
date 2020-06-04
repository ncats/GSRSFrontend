export interface UserDownload {
    id: string;
    numRecords: number;
    username: string;
    publicOnly: boolean;
    filename: string;
    cancelled: boolean;
    size?: number;
    started: number;
    finshed?: number;
    downloadUrl: DownloadUrl;
    removeUrl: DownloadUrl;
    self: DownloadUrl;
    status: string;
    complete: boolean;
    key: string;
    originalQuery?: string;
}

export interface DownloadUrl {
    url: string;
    type: string;
}

export interface AllUserDownloads {
    downloads: Array< UserDownload >;
}
