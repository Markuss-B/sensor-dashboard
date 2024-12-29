import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationRule } from '@models/notification-rule';
import { NotificationService } from '@services/notification.service';
import { TableComponent } from "../../shared/table/table.component";
import { NotificationsListComponent } from "@features/notifications-list/notifications-list.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rule-details',
  standalone: true,
  imports: [FormsModule, TableComponent, NotificationsListComponent, CommonModule],
  templateUrl: './rule-details.component.html',
  styleUrl: './rule-details.component.scss'
})
export class RuleDetailsComponent {
  constructor(
    private notificationsService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }
  
  rule: NotificationRule;

  isEditing: boolean = false;
  isSubmitting: boolean = false;
  submitError: boolean = false;

  ngOnInit(): void {
    var ruleId = this.route.snapshot.paramMap.get('id')!;

    this.notificationsService.getNotificationRule(ruleId).subscribe(data => {
      this.rule = data;
      this.rule.ruleString = this.createRuleString(this.rule);
    });
  }

  tableColumns = [
    { key: 'id', label: 'Id' },
    { key: 'sensorId', label: 'Sensors' },
    { key: 'message', label: 'Iemesls' },
    { key: 'timestamp', label: 'Laiks' },
    { key: 'acknowledged', label: 'Apstiprināts', format: (acknowledged: boolean) => acknowledged ? 'Jā' : 'Nē' }
  ];

  edit(): void {
    this.isEditing = true;
    console.log('Edit sensor');
  }

  submit(): void {
    this.isSubmitting = true;
    this.submitError = false;

    if (this.rule.ruleString == null) {
      this.submitError = true;
      this.isSubmitting = false;
      return;
    }

    var parts = this.rule.ruleString.split(' ');

    this.rule.measurement = parts[0];
    this.rule.operator = parts[1];
    this.rule.value = parseFloat(parts[2]);

    if (!this.validRuleString(this.rule.ruleString)) {
      this.submitError = true;
      this.isSubmitting = false;
      return;
    }

    this.notificationsService.updateNotificationRule(this.rule)
    .subscribe({
      complete: () => {
        this.reload(() => {
          this.isSubmitting = false;
          this.isEditing = false;
        });
      },
      error: (error) => {
        this.submitError = true;
        this.isSubmitting = false;
        console.error('Error updating sensor', error);
      }
    });
  }

  cancel(): void {
    this.isEditing = false;
    this.submitError = false;
    console.log('Cancel sensor');
  }

  deleteRule(): void {
    if (!confirm('Vai tiešām vēlaties dzēst šo paziņojuma noteikumu?')) {
      return;
    }

    this.notificationsService.deleteNotificationRule(this.rule.id!).subscribe(() => {
      this.router.navigate(['/notifications/rules']);
    });
  }

  private reload(callback: () => void): void {
    this.notificationsService.getNotificationRule(this.rule.id!).subscribe(data => {
      this.rule = data;
      this.rule.ruleString = this.createRuleString(this.rule);

      callback();
    });
  }

  private validRuleString(string: string): boolean {
    var parts = string.split(' ');

    if (parts.length != 3) {
      return false;
    }

    if (parts[1] != '>' && parts[1] != '<') {
      return false;
    }

    if (isNaN(parseInt(parts[2]))) {
      return false;
    }

    return true;
  }

  private createRuleString(rule: NotificationRule): string {
    return `${rule.measurement} ${rule.operator} ${rule.value}`;
  }
}
