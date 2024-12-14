import { Component } from '@angular/core';
import { TableComponent } from '../../shared/table/table.component';
import { SensorService } from '../../services/sensor.service';
import { Sensor } from '../../models/sensor';
import { Router } from '@angular/router';

import { SensorDetailsComponent } from '../sensor-details/sensor-details.component';

@Component({
  selector: 'app-sensor-list',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './sensor-list.component.html',
  styleUrl: './sensor-list.component.css'
})
export class SensorListComponent {

  constructor(private sensorService: SensorService, private router: Router) { }

  sensors: Sensor[] = [];

  ngOnInit(): void {
    this.sensorService.getSensors().subscribe(sensors => {
      this.sensors = sensors;

      // Convert metadata to string for display
      sensors.forEach(sensor => {
        if (sensor.metadata != undefined) {
          sensor.metadata = Object.entries(sensor.metadata).map(([key, value]) => `${key}: ${value}`);
        }

        if (sensor.latestMeasurements != undefined) {
          sensor.latestMeasurements = Object.entries(sensor.latestMeasurements).map(([key, value]) => `${key}: ${value}`);
        }
      });

      console.log(sensors);
    });
  }

  tableColumns = [
    { key: 'id', label: 'Id' },
    { key: 'location', label: 'Atrašanās vieta' },
    { key: 'isActive', label: 'Aktīvs', format: (isActive: boolean) => isActive ? 'Jā' : 'Nē' },
    { key: 'metadata', label: 'Metadati'},
    { key: 'latestMeasurements', label: 'Pēdējie mērījumi'}
  ];
  
  handleAction(event: { action: string, row: any }) {
    console.log(event);
    if (event.action === 'Skatīt') {
      this.router.navigate(['/sensor', event.row.id]);
    }
  }
  
}
