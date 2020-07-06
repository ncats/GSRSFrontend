export interface ScheduledJob {
    id: number;
    key: string;
    running: boolean;
    enabled: boolean;
    url: string;
    nextRun?: number;
    status?: string;
    numberOfRuns?: number;
    description?: string;
    cronSchedule?: string;
    lastDurationHuman?: any;
    lastFinished?: number;
    lastStarted?: number;
    '@execute'?: string;
    '@enable'?: string;
    '@cancel'?: string;
    '@disable'?: string;


}
