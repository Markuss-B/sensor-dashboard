import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { SensorMeasurements } from '../models/sensor-measurements';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SensorHubService {
	private hubConnection: signalR.HubConnection;
	private sensorMeasurementsSubject = new BehaviorSubject<SensorMeasurements | null>(null);
	private connectionPromise: Promise<void>;

	private hubUrl = 'http://localhost:5291/sensorhub';

	constructor() {
		this.hubConnection = new signalR.HubConnectionBuilder()
			.withUrl(this.hubUrl)
			.build();

		this.hubConnection.on('ReceiveSensorUpdate', (measurement: SensorMeasurements) => {
			this.sensorMeasurementsSubject.next(measurement);
		});

		// Initialize connection promise
		this.connectionPromise = this.hubConnection.start()
			.then(() => console.log('SignalR connection established'))
			.catch(err => console.error('SignalR connection error:', err));

		window.addEventListener('beforeunload', () => {
			this.unsubscribeFromSensor('all');
			});
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
}
