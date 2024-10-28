import { Component, ChangeDetectorRef } from '@angular/core';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { SensorService } from '../../services/sensor.service';
import { SensorMeasurements } from '../../models/sensor-measurements';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

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
  styleUrls: ['./sensor-details.component.css']
})
export class SensorDetailsComponent {
  constructor(
    private sensorService: SensorService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) { }

  measurements: SensorMeasurements[] = [];
  seriesData: { [key: string]: ChartSeries[] } = {};

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  private updateSubscription: Subscription | undefined;

  ngOnInit(): void {
    const sensorId = this.route.snapshot.paramMap.get('id');

    if (!sensorId) return;

    this.sensorService.getSensorMeasurments(sensorId).subscribe(data => {
      this.measurements = data;
      this.seriesData = this.transformData(data);
      console.log(this.seriesData);
    });

    // Subscribe to real-time updates
    this.sensorService.subscribeToSensor(sensorId);
    this.updateSubscription = this.sensorService.getSensorUpdates().subscribe(update => {
      if (update) {
        this.handleRealTimeUpdate(update);
      }
    });
  }

  ngOnDestroy(): void {
    this.updateSubscription?.unsubscribe();
    this.sensorService.unsubscribeFromSensor(this.route.snapshot.paramMap.get('id')!);
  }

  private transformData(measurements: SensorMeasurements[]) {
    // sort the measurements by timestamp
    measurements.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const measurementTypes = Object.keys(measurements[0].measurements);

    // Create separate series for each measurement type
    const seriesData = measurementTypes.reduce((acc, measurementType) => {
      acc[measurementType] = [{
        name: measurementType.charAt(0).toUpperCase() + measurementType.slice(1),
        series: measurements.map(data => ({
          name: new Date(data.timestamp).toLocaleString(),
          value: parseFloat(data.measurements[measurementType])
        }))
      }];
      return acc;
    }, {} as { [key: string]: ChartSeries[] });

    return seriesData;
  }

  private handleRealTimeUpdate(update: SensorMeasurements) {
    console.log(update);

    // Deep clone the seriesData
    const newSeriesData = JSON.parse(JSON.stringify(this.seriesData));

    const measurementTypes = Object.keys(update.measurements);

    measurementTypes.forEach(measurementType => {
      const newPoint = {
        name: new Date(update.timestamp).toLocaleString(),
        value: parseFloat(update.measurements[measurementType])
      };

      // Add the new point to the cloned data
      const series = newSeriesData[measurementType][0].series;
      series.push(newPoint);

      // Optional: Limit series length
      if (series.length > 50) {
        series.shift();
      }
    });

    // Reassign seriesData
    this.seriesData = newSeriesData;

    // Mark for check to trigger change detection
    this.cd.markForCheck();
  }

  // Optional: Implement trackBy function if needed
  trackByIndex(index: number): number {
    return index;
  }
}
