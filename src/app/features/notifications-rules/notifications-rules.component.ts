import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationRule } from '@models/notification-rule';
import { NotificationService } from '@services/notification.service';
import { TableComponent } from "../../shared/table/table.component";

@Component({
  selector: 'app-notifications-rules',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './notifications-rules.component.html',
  styleUrl: './notifications-rules.component.css'
})
export class NotificationsRulesComponent {
  constructor(private notitifactionService: NotificationService, private router: Router) { }

  rules: NotificationRule[] = [];

  ngOnInit(): void {
    this.load();
  }

  tableColumns = [
    { key: 'id', label: 'Id' },
    { key: 'name', label: 'Nosaukums' },
    { key: 'sensorId', label: 'Sensora Id' },
    { key: 'measurement', label: 'Mērījums' },
    { key: 'operator', label: 'Operators' },
    { key: 'value', label: 'Vērtība' }
  ];
  
  handleAction(event: { action: string, row: any }) {
    console.log(event);
    if (event.action === 'Skatīt') {
      this.router.navigate(['/notifications/rules', event.row.id]);
    }
    else if (event.action === 'Dzēst') {
      if (!confirm('Vai tiešām vēlaties dzēst šo paziņojuma noteikumu?')) {
        return;
      }

      this.notitifactionService.deleteNotificationRule(event.row.id).subscribe(() => {
        this.rules = this.rules.filter(r => r.id !== event.row.id);
        console.log('Deleted');

        this.load();
      });
    }
  }

  addRule() {
    this.router.navigate(['/notifications/rules/new',]);
  }

  load() {
    this.notitifactionService.getNotificationRules().subscribe(rules => {
      this.rules = rules;
      console.log(rules);
    });
  }
  
}
