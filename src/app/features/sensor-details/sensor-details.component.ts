import { Component } from '@angular/core';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { SensorService } from '../../services/sensor.service';
import { SensorMeasurements } from '../../models/sensor-measurements';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

interface TransformedMeasurement {
	name: string;
	series: { name: string; value: string }[];
}

@Component({
	selector: 'app-sensor-details',
	standalone: true,
	imports: [CommonModule, NgxChartsModule],
	templateUrl: './sensor-details.component.html',
	styleUrls: ['./sensor-details.component.css']
})
export class SensorDetailsComponent {

	constructor(
		private sensorService: SensorService,
		private route: ActivatedRoute
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

	lastdate = new Date('2025-10-03');

	ngOnInit(): void {
		var sensorId = this.route.snapshot.paramMap.get('id');

		if (!sensorId)
			return;

		this.sensorService.getSensorMeasurments(sensorId).subscribe(data => {
			this.sensorData = this.transformData(data);
			console.log(this.sensorData[0]);
		});
	}

	trackByMeasurement(index: number, measurement: TransformedMeasurement): string {
		return measurement.name;
	}

	transformData(data: SensorMeasurements[]): TransformedMeasurement[] {
		return Object.keys(data[0].measurements).map((measurementName) => ({
			name: measurementName,
			series: data.map((item) => ({
				name: item.timestamp.toString(),
				value: item.measurements[measurementName as keyof typeof item.measurements]
			}))
		}));
	}

	updateData(newData: TransformedMeasurement): void {
		{
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

	addMockData() {
		// Increment last date correctly by 1 day
		this.lastdate.setDate(this.lastdate.getDate() + 1);
		const lastdateString = this.lastdate.toString();

		const newData: TransformedMeasurement = {
			name: 'temp',
			series: [
				{
					name: lastdateString,
					value: Math.floor(Math.random() * 100).toString()
				}
			]
		};

		this.updateData(newData);
	}
}
