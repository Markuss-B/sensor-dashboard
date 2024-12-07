import { Component } from '@angular/core';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { SensorService } from '../../services/sensor.service';
import { SensorMeasurements } from '../../models/sensor-measurements';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { SensorHubService } from '../../services/sensor-hub.service';
import { LegendPosition } from '@swimlane/ngx-charts';
import { MeasurementChartsComponent } from "./measurement-charts/measurement-charts.component";
import { Sensor } from '@models/sensor';
import { FormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-sensor-details',
	standalone: true,
	imports: [CommonModule, MeasurementChartsComponent, FormsModule],
	templateUrl: './sensor-details.component.html',
	styleUrls: ['./sensor-details.component.scss'],
})

/**
 * The SensorDetailsComponent is responsible for displaying and updating sensor data in a chart format.
 * It subscribes to sensor data updates and transforms the data for visualization.
 */
export class SensorDetailsComponent {
	constructor(
		private sensorService: SensorService,
		private route: ActivatedRoute,
	) { }

	sensor!: Sensor;

	isEditing: boolean = false;
	isSubmitting: boolean = false;
	submitError: boolean = false;

	ngOnInit(): void {
		var sensorId = this.route.snapshot.paramMap.get('id')!;
		this.sensorService.getSensorById(sensorId).subscribe(data => {
			this.sensor = data;
		});
	}

	edit(): void {
		this.isEditing = true;
		console.log('Edit sensor');
	}

	submit(): void {
		this.isSubmitting = true;
		this.submitError = false;

		this.sensorService.updateSensor(this.sensor)
		.subscribe({
			complete: () => {
				this.reload(() => {
					this.isSubmitting = false;
					this.isEditing = false;
				});
			},
			error: (error) => {
				this.submitError = true;
				this.isSubmitting = false;
				console.error('Error updating sensor', error);
			}
		});
	}

	cancel(): void {
		this.isEditing = false;
		this.submitError = false;
		console.log('Cancel sensor');
	}

	private reload(callback: () => void): void {
		this.sensorService.getSensorById(this.sensor.id).subscribe(data => {
			this.sensor = data;

			callback();
		});
	}
}
