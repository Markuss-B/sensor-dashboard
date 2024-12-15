import { NotificationRule } from './notification-rule';

export interface Notification {
    id: string;
    sensorId?: string;
    message: string;
    timestamp: Date;
    rule: NotificationRule;
    isAcknowledged: boolean;
}