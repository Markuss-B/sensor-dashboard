import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SensorMeasurements } from '@models/sensor-measurements';
import { SensorHubService } from '@services/sensor-hub.service';
import { SensorService } from '@services/sensor.service';
import { LegendPosition, Color, ScaleType, NgxChartsModule } from '@swimlane/ngx-charts';

/**
 * Represents a transformed sensor measurement data that is ready to be visualized in a chart.
 */
interface TransformedMeasurement {
	name: string;
	series: { name: string; value: string }[]; // name: timestamp, value: measurement value
}

@Component({
  selector: 'app-measurement-charts',
  standalone: true,
  imports: [CommonModule, DatePipe, NgxChartsModule],
  templateUrl: './measurement-charts.component.html',
  styleUrl: './measurement-charts.component.css'
})

/**
 * Component for visualizing sensor measurements in a charts.
 */
export class MeasurementChartsComponent implements OnInit, OnDestroy {

	constructor(
		private sensorService: SensorService,
		private sensorHub: SensorHubService,
		private datePipe: DatePipe
	) { }

  @Input() sensorId!: string;

	sensorData: TransformedMeasurement[] = [];

	legendPosition = LegendPosition.Right; // Position of the legend

	// Color scheme for the chart
	colorScheme: Color = {
		name: 'customScheme',
		selectable: true,
		group: ScaleType.Ordinal,
		domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
	};

	/**
	 * Initializes the component by fetching the sensor data and subscribing to sensor updates.
	 */
	ngOnInit(): void {
		this.sensorService.getTodaysSensorMeasurments(this.sensorId).subscribe(data => {
			this.sensorData = this.transformData(data);
			// console.log(this.sensorData[0]);
		});

		// Subscribe to sensor measurement updates. The webapi will push updates to the client when new measurements are available.
		this.sensorHub.subscribeToSensor(this.sensorId);
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
    	this.sensorHub.unsubscribeFromSensor(this.sensorId);
	}

	/**
	 * Custom trackBy function for the ngFor directive.
	 * Enables animations when adding/removing measurements from the chart.
	 */
	trackByMeasurement(index: number, measurement: TransformedMeasurement): string {
		return measurement.name;
	}

	/**
	 * Custom formatter for the X-axis of the chart.
	 * @param timestamp string
	 * @returns "HH:mm" formatted string
	 */
	xAxisDateFormatter = (timestamp: string): string => {
		return this.datePipe.transform(timestamp, 'HH:mm') as string;
	}

	/**
	 * Transforms the sensor data into a format that can be visualized in a chart.
	 * @param data 
	 * @returns 
	 */
	private transformData(data: SensorMeasurements[]): TransformedMeasurement[] {
		return Object.keys(data[0].measurements).map((measurementName) => ({
			name: measurementName,
			series: data.map((item) => ({
				name: this.datePipe.transform(item.timestamp, 'short') as string,
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
