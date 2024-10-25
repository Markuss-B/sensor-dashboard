import { SensorMeasurements } from "./sensor-measurements";

export interface Sensor {
    id: string;
    baseSerialNumber: string;
    rootTopic: string;
    name: string;
    productNumber: string;
    group: string;
    groupId: string;
    sensorMeasurements: SensorMeasurements[];
}
