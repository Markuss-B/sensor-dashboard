import { SensorMeasurements } from "./sensor-measurements";

export interface Sensor {
    id: string;
    location: string;
    isActive: boolean;
    topics: string[];
    metadata: Record<string, string> | string[];
    latestMeasurements: Record<string, string> | string[];
}

export interface SensorUpdateDto {
    id: string;
    location: string;
    isActive: boolean;
}