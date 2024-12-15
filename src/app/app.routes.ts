import { Routes } from '@angular/router';
import { SensorListComponent } from './features/sensor-list/sensor-list.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { SensorDetailsComponent } from './features/sensor-details/sensor-details.component';
import { NotificationsComponent } from '@features/notifications/notifications.component';
import { NotificationsRulesComponent } from '@features/notifications-rules/notifications-rules.component';
import { RuleDetailsComponent } from '@features/notifications-rules/rule-details/rule-details.component';
import { RuleCreateComponent } from '@features/notifications-rules/rule-create/rule-create.component';

export const routes: Routes = [
  { path: 'sensors', component: SensorListComponent },
  // { path: 'dashboard', component: DashboardComponent },
  { path: 'sensor/:id', component: SensorDetailsComponent },
  { path: 'notifications', component: NotificationsComponent},
  { path: 'notifications/rules', component: NotificationsRulesComponent },
  { path: 'notifications/rules/new', component: RuleCreateComponent },
  { path: 'notifications/rules/:id', component: RuleDetailsComponent },
  { path: '', redirectTo: '/sensors', pathMatch: 'full' }
]