export interface ScheduledJob {
    id: number;
    key: string;
    running: boolean;
    enabled: boolean;
    url: string;
    nextRun?: number;
    status?: string;
    numberOfRuns?: number
    description?: string;
    cronSchedule?: string;
    '@execute'?: string;
    '@enable'?: string;
    '@cancel'?: string;
    '@disable'?: string;


}