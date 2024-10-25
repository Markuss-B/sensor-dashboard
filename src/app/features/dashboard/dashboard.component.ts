import { Component, OnInit } from '@angular/core';
import { SensorService } from '../../services/sensor.service';
import { Sensor } from '../../models/sensor';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  constructor(private sensorService: SensorService) { }

  sensors: Sensor[] = [];

  ngOnInit(): void {
    this.sensorService.getSensors().subscribe(sensors => {
      this.sensors = sensors;
    }
    );
  }

}
