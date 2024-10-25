import { Sensor } from "./sensor";

export interface SensorMeasurements {
    id: string;
    timestamp: string;
    sensorId: string;
    sensor: Sensor;
    co2: number;
    temperature: number;
    battery: number;
    atmosphericPressure: number;
    rssi: number;
}
