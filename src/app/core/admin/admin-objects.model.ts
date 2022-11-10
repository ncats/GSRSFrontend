export interface HealthInfo {
    epoch: number;
    uptime: Array< number >;
    threads: number;
    runningThreads: number;
    javaVersion: string;
    hostname: string;
    runtime: {
        availableProcessors: number;
        freeMemory: number;
        totalMemory: number;
        maxMemory: number;
    };
    databaseInformation: Array< DatabaseInfo >;
    cacheInfo: {
        maxCacheElements: number;
        maxNotEvictableCacheElements: number;
        timeToLive: number;
        timeToIdle: number;
    };
}

export interface DatabaseInfo {
        database: string;
        driver: string;
        product: string;
        connected: boolean;
        maxConnectionPool?: number;
        activeConnection?: number;
        latency: number;
}

export interface UserEditObject {
        username: string;
        isAdmin: boolean;
        isActive: boolean;
        email: string;
        roles: Array< any >;
        groups: Array< any >;
        password?: string;
        index?: any;
        id?: any;
}

export interface UploadObject {
    statistics?: UploadStatistics;
    keys?: Array< any >;
    id: any;
    message?: string;
    start?: number;
    stop?: number;
    name?: string;
    status: string;
    version?: number;
    _self?: {
        type: string;
        url: string;
        };
}

export interface UploadStatistics {
    totalRecords: {
        count: number;
    };
    averageTimeToPersist?: number;
    estimatedTimeLeft?: number;
    recordsExtractedFailed?: number;
    recordsExtractedSuccess?: number;
    recordsPersistedFailed?: number;
    recordsPersistedSuccess?: number;
    recordsProcessedFailed?: number;
    recordsProcessedSuccess?: number;
}


export interface DirectoryFile {
    id: string;
    parent: string;
    text: string;
    isDir: boolean;
    hasLink?: string;
    order?: string;
    children?: Array< DirectoryFile >;
}
