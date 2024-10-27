import { Sensor } from "./sensor";

export interface SensorMeasurements {
    sensorId: string;
    timestamp: Date;
    measurements: Record<string, any>;
}

export interface SensorMeasurementsFixed {
    sensorId: string;
    timestamp: Date;
    measurements: Measurement[];
}

export interface Measurement {
    co2: number;
    temperature: number;
    battery: number;
    atmosphericPressure: number;
    rssi: number;
}
