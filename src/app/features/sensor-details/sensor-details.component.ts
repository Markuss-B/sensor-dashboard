import { Component } from '@angular/core';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { SensorService } from '../../services/sensor.service';
import { SensorMeasurements } from '../../models/sensor-measurements';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { SensorHubService } from '../../services/sensor-hub.service';

/**
 * Represents a transformed sensor measurement data that is ready to be visualized in a chart.
 */
interface TransformedMeasurement {
	name: string;
	series: { name: string; value: string }[];
}

@Component({
	selector: 'app-sensor-details',
	standalone: true,
	imports: [CommonModule, DatePipe, NgxChartsModule],
	templateUrl: './sensor-details.component.html',
	styleUrls: ['./sensor-details.component.css'],
})

/**
 * The SensorDetailsComponent is responsible for displaying and updating sensor data in a chart format.
 * It subscribes to sensor data updates and transforms the data for visualization.
 */
export class SensorDetailsComponent {

	constructor(
		private sensorService: SensorService,
		private route: ActivatedRoute,
		private sensorHub: SensorHubService,
		private datePipe: DatePipe
	) { }

	sensorData: TransformedMeasurement[] = [];

	view: [number, number] = [700, 400];

	// Color scheme for the chart
	colorScheme: Color = {
		name: 'customScheme',
		selectable: true,
		group: ScaleType.Ordinal,
		domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
	};

	ngOnInit(): void {
		var sensorId = this.route.snapshot.paramMap.get('id');

		if (!sensorId)
			return;

		this.sensorService.getTodaysSensorMeasurments(sensorId).subscribe(data => {
			this.sensorData = this.transformData(data);
			// console.log(this.sensorData[0]);
		});

		this.sensorHub.subscribeToSensor(sensorId);

		this.sensorHub.getSensorUpdates().subscribe((update) => {
			console.log(update);
			if (update)
			{
				var transformedData = this.transformData([update]);
				transformedData.forEach((measurement) => {
					this.updateData(measurement);
				});
			}
		});
	}

	ngOnDestroy(): void {
		var sensorId = this.route.snapshot.paramMap.get('id');

		if (!sensorId)
			return;

		this.sensorHub.unsubscribeFromSensor(sensorId);
	}

	trackByMeasurement(index: number, measurement: TransformedMeasurement): string {
		return measurement.name;
	}

	transformData(data: SensorMeasurements[]): TransformedMeasurement[] {
		return Object.keys(data[0].measurements).map((measurementName) => ({
			name: measurementName,
			series: data.map((item) => ({
				name: this.datePipe.transform(item.timestamp, 'HH:mm') as string,
				value: item.measurements[measurementName as keyof typeof item.measurements]
			}))
		}));
	}

	/**
	 * Updates the sensor data array with new measurements.
	 * 
	 * If a measurement with the same name as `newData` exists, it updates the series of that measurement
	 * by appending the new series data. If no matching measurement is found, it adds `newData` as a new chart.
	 * 
	 * @param newData - The new measurement data to be added or used to update existing data. @see `transformData` for the expected format of `newData`.
	 */
	private updateData(newData: TransformedMeasurement): void {
		const existingMeasurement = this.sensorData.find(measurement => measurement.name === newData.name);

		if (existingMeasurement) {
			// If a matching measurement is found, update its series
			this.sensorData = this.sensorData.map((measurement) => {
				if (measurement.name === newData.name) {
					return {
						...measurement,
						series: [
							...measurement.series,
							{
								name: newData.series[0].name,
								value: newData.series[0].value
							}
						]
					};
				} else {
					return measurement;
				}
			});
		} else {
			// If no matching measurement, add newData as a new chart
			this.sensorData = [
				...this.sensorData,
				{
					name: newData.name,
					series: newData.series
				}
			];
		}
	}
}
