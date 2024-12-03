import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sensor } from '../models/sensor';
import { SensorMeasurements } from '../models/sensor-measurements';

@Injectable({
  providedIn: 'root'
})
export class SensorService {

  private apiUrl = 'http://localhost:5291/api/Sensor';

  constructor(private http: HttpClient) { }

  getSensors(): Observable<Sensor[]> {
    return this.http.get<Sensor[]>(`${this.apiUrl}`);
  }

  getSensor(collectionPrefix: string, sensorId: string): Observable<Sensor> {
    return this.http.get<Sensor>(`${this.apiUrl}/${collectionPrefix}/${sensorId}`);
  }

  getSensorMeasurments(collectionPrefix: string, sensorId: string, dateFrom?: Date, dateTo?: Date): Observable<SensorMeasurements[]> {
    return this.http.get<SensorMeasurements[]>(`${this.apiUrl}/${collectionPrefix}/${sensorId}/measurements?dateFrom=${dateFrom ?? ''}&dateTo=${dateTo ?? ''}`);
  }
}
