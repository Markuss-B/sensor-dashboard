import { Routes } from '@angular/router';
import { SensorListComponent } from './features/sensor-list/sensor-list.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { SensorDetailsComponent } from './features/sensor-details/sensor-details.component';

export const routes: Routes = [
  { path: 'sensors', component: SensorListComponent },
  // { path: 'dashboard', component: DashboardComponent },
  { path: 'sensor/:id', component: SensorDetailsComponent },
  { path: '', redirectTo: '/sensors', pathMatch: 'full' }
]