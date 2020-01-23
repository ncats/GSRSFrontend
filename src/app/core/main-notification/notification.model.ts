export interface AppNotification {
    message: string;
    type?: NotificationType;
    milisecondsToShow?: number;
}

export enum NotificationType {
    default = 1,
    success = 2,
    error = 3
}
