import { SensorMeasurements } from "./sensor-measurements";

export interface Sensor {
    id: string;
    topics: string[];
    location: string;
    name: string;
    productNumber: string;
    group: string;
    groupId: string;
    isActive?: boolean | null;
}

export interface SensorUpdateDto {
    id: string;
    location: string;
    isActive: boolean;
}