export interface HealthInfo {
    epoch: number;
    uptime: Array< number >;
    threads: number;
    runningThreads: number;
    javaVersion: string;
    hostname: string;
    runtime: {
        availableProcessors: number;
        freeMemory:number;
        totalMemory:number;
        maxMemory:number;
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
        latency: number;
}

export interface UserEditObject {
        username: string;
        isAdmin: boolean;
        isActive: boolean;
        email: string;
        roles: Array< any >;
        groups : Array< any >;
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
        type: string,
        url: string
        };
}

export interface UploadStatistics {

averageTimeToPersist?: number;
estimatedTimeLeft?: number;
recordsExtractedFailed?: number;
recordsExtractedSuccess?: number;
recordsPersistedFailed?: number;
recordsPersistedSuccess?: number;
recordsProcessedFailed?: number;
recordsProcessedSuccess?: number;
}
