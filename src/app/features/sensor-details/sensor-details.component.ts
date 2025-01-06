import { Component } from '@angular/core';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { SensorService } from '../../services/sensor.service';
import { SensorMeasurements } from '../../models/sensor-measurements';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { SensorHubService } from '../../services/sensor-hub.service';
import { LegendPosition } from '@swimlane/ngx-charts';
import { MeasurementChartsComponent } from "./measurement-charts/measurement-charts.component";
import { Sensor, SensorUpdateDto } from '@models/sensor';
import { FormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';

/**
 * The SensorDetailsComponent is responsible for displaying the details of a sensor.
 * It also uses the MeasurementChartsComponent to display the measurements of the sensor.
 */
@Component({
	selector: 'app-sensor-details',
	standalone: true,
	imports: [CommonModule, MeasurementChartsComponent, FormsModule],
	templateUrl: './sensor-details.component.html',
	styleUrls: ['./sensor-details.component.scss'],
})
export class SensorDetailsComponent {
	constructor(
		private sensorService: SensorService,
		private route: ActivatedRoute,
	) { }

	sensor: Sensor;
	metadata: string[];
	sensorUpdateModel: SensorUpdateDto; // Used when editing

	isEditing: boolean = false;
	isSubmitting: boolean = false;
	submitError: boolean = false;

	ngOnInit(): void {
		// Get the sensor id from the route
		var sensorId = this.route.snapshot.paramMap.get('id')!;
		// Fetch the sensor
		this.sensorService.getSensorById(sensorId).subscribe(data => {
			this.sensor = data;

			// Convert metadata to string for display
			if (this.sensor.metadata != undefined) {
				this.metadata = Object.entries(this.sensor.metadata).map(([key, value]) => `${key}: ${value}`);
			}
		});
	}

	/**
	 * Enables editing of the sensor.
	 */
	edit(): void {
		this.sensorUpdateModel = {
			id: this.sensor.id,
			location: this.sensor.location,
			isActive: this.sensor.isActive,
			description: this.sensor.description
		};

		this.isEditing = true;
		console.log('Edit sensor');
	}

	/**
	 * Submits the sensorUpdateModel to update the sensor data
	 */
	submit(): void {
		this.isSubmitting = true;
		this.submitError = false;

		this.sensorService.updateSensor(this.sensorUpdateModel)
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

	/**
	 * Cancels the editing of the sensor.
	 */
	cancel(): void {
		this.isEditing = false;
		this.submitError = false;
		console.log('Cancel sensor');
	}

	/**
	 * Reloads the sensor data.
	 * @param callback The callback to call after the sensor has been reloaded.
	 */
	private reload(callback: () => void): void {
		this.sensorService.getSensorById(this.sensor.id).subscribe(data => {
			this.sensor = data;

			callback();
		});
	}
}
