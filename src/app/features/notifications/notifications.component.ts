import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '@services/notification.service';
import { Notification } from '@models/notification';
import { TableComponent } from "../../shared/table/table.component";

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  constructor(private notitifactionService: NotificationService, private router: Router) { }

  @Input() inputNotifications: Notification[] = [];

  notifications: Notification[] = [];

  ngOnInit(): void {
    if (this.inputNotifications.length === 0) {
      this.notitifactionService.getNotifications().subscribe(data => {
        this.notifications = data;
      });
    } else {
      this.notifications = this.inputNotifications;
    }
  }

  tableColumns = [
    { key: 'id', label: 'Id' },
    { key: 'sensorId', label: 'Sensors' },
    { key: 'message', label: 'Iemesls' },
    { key: 'timestamp', label: 'Laiks' },
  ];

  handleAction(event: { action: string, row: any }) {
    console.log(event);
    if (event.action === 'Skatī noteikumu') {
      this.router.navigate(['/notifications/rules', event.row.rule.id]);
    }
  }
}
