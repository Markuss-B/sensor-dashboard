import { Notification } from './notification';

export interface NotificationRule {
    id: string;
    name?: string;
    sensorId?: string;
    measurement: string;
    operator: string;
    value: number;
    notifications: Notification[];
    ruleString?: string;
}