import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '@services/notification.service';
import { Notification } from '@models/notification';
import { TableComponent } from "../../shared/table/table.component";
import { DatePipe } from '@angular/common';

/**
 * The NotificationsListComponent is responsible for displaying a list of notifications.
 */
@Component({
  selector: 'app-notifications-list',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './notifications-list.component.html',
  styleUrl: './notifications-list.component.css'
})
export class NotificationsListComponent {
  constructor(private notitifactionService: NotificationService, private router: Router, private datePipe: DatePipe) { }

  /**
   * Used to pass notifications to the component. Used by rule-details component.
   */
  @Input() inputNotifications: Notification[] | undefined = undefined;
  /**
   * Used to hide the actions column. Used by rule-details component.
   */
  @Input() showActions: boolean = true;

  notifications: Notification[] = [];

  ngOnInit(): void {
    // Fetch notifications if not passed as input
    if (this.inputNotifications === undefined) {
      this.notitifactionService.getNotifications().subscribe(data => {
        this.notifications = data;
      });
    } else {
      this.notifications = this.inputNotifications;
    }
  }

  // Defines the table
  tableColumns = [
    { key: 'id', label: 'Id' },
    { key: 'sensorId', label: 'Sensors' },
    { key: 'message', label: 'Iemesls' },
    { key: 'startTimestamp', label: 'Izveidots', format: (timestamp: string) => this.formatDate(timestamp) },
    { key: 'endTimestamp', label: 'Beidzies', format: (timestamp: string) => this.formatDate(timestamp) }
  ];

  /**
   * Handles the view action when a row is clicked
   * @param event event containing the action and the row
   */
  handleAction(event: { action: string, row: any }) {
    console.log(event);
    if (event.action === 'Skatīt noteikumu') {
      this.router.navigate(['/notifications/rules', event.row.ruleId]);
    }
  }

  /**
   * Formats a timestamp to a readable date
   * @param timestamp timestamp to format
   * @returns formatted date
   */
  formatDate(timestamp: string) {
    return this.datePipe.transform(timestamp, 'YYYY-MM-dd HH:mm:ss') as string;
  }
}
