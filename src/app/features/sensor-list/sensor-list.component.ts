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
    }
    );
  }

  tableColumns = [
    { key: 'id', label: 'Id' },
    { key: 'name', label: 'Nosaukums' },
    { key: 'location', label: 'Atrašanāš vieta' },
    { key: 'baseSerialNumber', label: 'Bāzes satcijas numurs' },
    { key: 'group', label: 'Grupa' },
    { key: 'productNumber', label: 'Produkta numurs' },
    { key: 'rootTopic', label: 'Saknes tēma' }
  ];
  
  handleAction(event: { action: string, row: any }) {
    console.log(event);
    if (event.action === 'View') {
      this.router.navigate(['/sensor', event.row.id]);
    }
  }
}
