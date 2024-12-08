import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sensor } from '../models/sensor';
import { SensorMeasurements } from '../models/sensor-measurements';

@Injectable({
  providedIn: 'root'
})

/**
 * Service for fetching sensor data from the webapi.
 */
export class SensorService {
  private apiUrl = 'http://localhost:5223/api/Sensor';

  constructor(private http: HttpClient) {}

  /**
   * Fetches all sensors from the webapi.
   */
  getSensors(): Observable<Sensor[]> {
    return this.http.get<Sensor[]>(`${this.apiUrl}`);
  }

  /**
   * Fetches a sensor by its id from the webapi.
   * @param sensorId 
   */
  getSensorById(sensorId: string): Observable<Sensor> {
    return this.http.get<Sensor>(`${this.apiUrl}/${sensorId}`);
  }

  /**
   * Fetches the measurements for a sensor from the webapi.
   * @param sensorId 
   */
  getTodaysSensorMeasurments(sensorId: string): Observable<SensorMeasurements[]> {
    return this.http.get<SensorMeasurements[]>(`${this.apiUrl}/${sensorId}/measurements/today`);
  }

  /**
   * Updates a sensor in the webapi (currently only updates location).
   * @param sensor 
   */
  updateSensor(sensor: Sensor): Observable<Sensor> {
	  return this.http.put<Sensor>(`${this.apiUrl}`, sensor);
  }
}
