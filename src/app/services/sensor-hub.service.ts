import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { SensorMeasurements } from '../models/sensor-measurements';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';

/**
 * Service for subscribing to sensor updates from the SensorHub SignalR hub.
 */
@Injectable({
	providedIn: 'root'
})
export class SensorHubService {
	private hubConnection: signalR.HubConnection;
	private sensorMeasurementsSubject = new BehaviorSubject<SensorMeasurements | null>(null);
	private connectionPromise: Promise<void>;

	private hubUrl = environment.apiUrl +'/api/sensorhub';

	/**
	 * Initializes the SensorHubService by creating a SignalR hub connection.
	 */
	constructor() {
		this.hubConnection = new signalR.HubConnectionBuilder()
			.withUrl(this.hubUrl)
			.build();

		// Handle incoming sensor updates
		this.hubConnection.on('ReceiveSensorUpdate', (measurement: SensorMeasurements) => {
			this.sensorMeasurementsSubject.next(measurement);
		});

		// Initialize connection promise
		this.connectionPromise = this.hubConnection.start()
			.then(() => console.log('SignalR connection established'))
			.catch(err => console.error('SignalR connection error:', err));
	}

	/**
	 * Subscribes to a sensor to receive real-time updates receivable by the {@link getSensorUpdates} observable.
	 * @param sensorId 
	 */
	async subscribeToSensor(sensorId: string) {
		console.log('Subscribing to sensor:', sensorId);

		await this.connectionPromise; // Ensure the connection is established
		this.hubConnection.invoke('SubscribeToSensor', sensorId)
			.catch(err => console.error('Subscription error:', err));
	}

	/**
	 * Unsubscribes from a sensor to stop receiving real-time updates.
	 * @param sensorId 
	 */
	async unsubscribeFromSensor(sensorId: string) {
		console.log('Unsubscribing from sensor:', sensorId);

		await this.connectionPromise; // Ensure the connection is established
		this.hubConnection.invoke('UnsubscribeFromSensor', sensorId)
			.catch(err => console.error('Unsubscription error:', err));
	}

	/**
	 * Returns an observable that emits sensor updates.
	 * @returns An observable that emits sensor updates.
	 */
	getSensorUpdates(): Observable<SensorMeasurements> {
		return this.sensorMeasurementsSubject.asObservable() as Observable<SensorMeasurements>;
	}
}
