import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sensor } from '../models/sensor';
import { SensorMeasurements } from '../models/sensor-measurements';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  
  private apiUrl = 'http://localhost:5223/api/Sensor';

  constructor(private http: HttpClient) {}

  getSensors(): Observable<Sensor[]> {
    return this.http.get<Sensor[]>(`${this.apiUrl}`);
  }

  getSensorById(sensorId: string): Observable<Sensor> {
    return this.http.get<Sensor>(`${this.apiUrl}/${sensorId}`);
  }

  getLatestSensorMeasurment(sensorId: string): Observable<SensorMeasurements> {
    return this.http.get<SensorMeasurements>(`${this.apiUrl}/${sensorId}/latestmeasurment`);
  }

  getSensorMeasurments(sensorId: string, dateFrom?: Date, dateTo?: Date): Observable<SensorMeasurements[]> {
    return this.http.get<SensorMeasurements[]>(`${this.apiUrl}/${sensorId}/measurments?dateFrom=${dateFrom ?? ''}&dateTo=${dateTo ?? ''}`);
  }
}
