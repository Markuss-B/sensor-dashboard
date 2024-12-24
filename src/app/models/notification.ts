import { NotificationRule } from './notification-rule';

export interface Notification {
    id: string;
    sensorId?: string;
    message: string;
    startTimestamp: Date;
    endTimestamp?: Date;
    ruleId: string;
}