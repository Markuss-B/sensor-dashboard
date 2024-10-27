import { Component } from '@angular/core';
import { Color, id, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { SensorService } from '../../services/sensor.service';
import { SensorMeasurements } from '../../models/sensor-measurements';
import { ActivatedRoute } from '@angular/router';

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface ChartSeries {
  name: string;
  series: ChartDataPoint[];
}

@Component({
  selector: 'app-sensor-details',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './sensor-details.component.html',
  styleUrl: './sensor-details.component.css'
})
export class SensorDetailsComponent {
  constructor(private sensorService: SensorService, private route: ActivatedRoute) { }

  measurements: SensorMeasurements[] = [];
  seriesData: { [key: string]: ChartSeries[] } = {};

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  ngOnInit(): void {
    const sensorId = this.route.snapshot.paramMap.get('id');

    if (!sensorId)
      return;

    this.sensorService.getSensorMeasurments(sensorId).subscribe(data => {
      this.measurements = data;
      this.transformData();
      console.log(this.seriesData);
    }
    );
  }

  private transformData() {
    const measurementTypes = Object.keys(this.measurements[0].measurements);

    // Create separate series for each measurement type
    this.seriesData = measurementTypes.reduce((acc, measurementType) => {
      acc[measurementType] = [{
        name: measurementType.charAt(0).toUpperCase() + measurementType.slice(1),
        series: this.measurements.map(data => ({
          name: new Date(data.timestamp).toLocaleString(),
          value: parseFloat(data.measurements[measurementType])
        }))
      }];
      return acc;
    }, {} as { [key: string]: ChartSeries[] });
  }
}
