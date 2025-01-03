import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '@services/notification.service';
import { Notification } from '@models/notification';
import { TableComponent } from "../../shared/table/table.component";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notifications-list',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './notifications-list.component.html',
  styleUrl: './notifications-list.component.css'
})
export class NotificationsListComponent {
  constructor(private notitifactionService: NotificationService, private router: Router, private datePipe: DatePipe) { }

  @Input() inputNotifications: Notification[] | undefined = undefined;
  @Input() showActions: boolean = true;

  notifications: Notification[] = [];

  ngOnInit(): void {
    if (this.inputNotifications === undefined) {
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
    { key: 'startTimestamp', label: 'Izveidots', format: (timestamp: string) => this.formatDate(timestamp) },
    { key: 'endTimestamp', label: 'Beidzies', format: (timestamp: string) => this.formatDate(timestamp) }
  ];

  handleAction(event: { action: string, row: any }) {
    console.log(event);
    if (event.action === 'Skatīt noteikumu') {
      this.router.navigate(['/notifications/rules', event.row.ruleId]);
    }
  }

  formatDate(timestamp: string) {
    return this.datePipe.transform(timestamp, 'YYYY-MM-dd HH:mm:ss') as string;
  }
}
