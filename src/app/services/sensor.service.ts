import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Sensor } from '../models/sensor';
import { SensorMeasurements } from '../models/sensor-measurements';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SensorService {

  private hubConnection: signalR.HubConnection;
  private sensorMeasurementsSubject = new BehaviorSubject<SensorMeasurements | null>(null);
  private connectionPromise: Promise<void>;
  
  private apiUrl = 'http://localhost:5223/api/Sensor';

  constructor(private http: HttpClient) {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5223/sensorhub') // Ensure this URL matches your backend SignalR hub URL
    .build();

    this.hubConnection.on('ReceiveSensorUpdate', (measurement: SensorMeasurements) => {
      this.sensorMeasurementsSubject.next(measurement);
    });

        // Initialize connection promise
        this.connectionPromise = this.hubConnection.start()
        .then(() => console.log('SignalR connection established'))
        .catch(err => console.error('SignalR connection error:', err));
  }

  // Method to subscribe to a specific sensor's updates, waiting for connection to start
  async subscribeToSensor(sensorId: string) {
    await this.connectionPromise; // Ensure the connection is established
    this.hubConnection.invoke('SubscribeToSensor', sensorId)
      .catch(err => console.error('Subscription error:', err));
  }

  async unsubscribeFromSensor(sensorId: string) {
    await this.connectionPromise; // Ensure the connection is established
    this.hubConnection.invoke('UnsubscribeFromSensor', sensorId)
      .catch(err => console.error('Unsubscription error:', err));
  }

  // Observable to get real-time measurements
  getSensorUpdates() {
    return this.sensorMeasurementsSubject.asObservable();
  }

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
