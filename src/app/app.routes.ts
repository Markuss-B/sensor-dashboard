import { Routes } from '@angular/router';
import { SensorListComponent } from './features/sensor-list/sensor-list.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { SensorDetailsComponent } from './features/sensor-details/sensor-details.component';
import { NotificationsListComponent } from './features/notifications-list/notifications-list.component';
import { RuleListComponent } from './features/rule-list/rule-list.component';
import { RuleDetailsComponent } from '@features/rule-details/rule-details.component';
import { RuleCreateComponent } from '@features/rule-create/rule-create.component';

export const routes: Routes = [
  { path: 'sensors', component: SensorListComponent },
  // { path: 'dashboard', component: DashboardComponent },
  { path: 'sensor/:id', component: SensorDetailsComponent },
  { path: 'notifications', component: NotificationsListComponent},
  { path: 'notifications/rules', component: RuleListComponent },
  { path: 'notifications/rules/new', component: RuleCreateComponent },
  { path: 'notifications/rules/:id', component: RuleDetailsComponent },
  { path: '', redirectTo: '/sensors', pathMatch: 'full' }
]