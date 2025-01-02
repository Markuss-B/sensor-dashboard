import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sensor, SensorUpdateDto } from '../models/sensor';
import { SensorMeasurements } from '../models/sensor-measurements';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})

/**
 * Service for fetching sensor data from the webapi.
 */
export class SensorService {
  private apiUrl = environment.apiUrl + '/api/sensor';
  
  constructor(private http: HttpClient) {}

  /**
   * Fetches all sensors.
   */
  getSensors(): Observable<Sensor[]> {
    return this.http.get<Sensor[]>(`${this.apiUrl}`);
  }

  /**
   * Fetches a sensor by its id.
   * @param sensorId 
   */
  getSensorById(sensorId: string): Observable<Sensor> {
    return this.http.get<Sensor>(`${this.apiUrl}/${sensorId}`);
  }

  /**
   * Fetches the measurements for a sensor.
   * @param sensorId 
   */
  getTodaysSensorMeasurments(sensorId: string): Observable<SensorMeasurements[]> {
    return this.http.get<SensorMeasurements[]>(`${this.apiUrl}/${sensorId}/measurements/today`);
  }

  /**
   * Updates a sensor.
   * @param sensor 
   */
  updateSensor(sensor: SensorUpdateDto): Observable<any> {
	  return this.http.patch(`${this.apiUrl}`, sensor);
  }
}
