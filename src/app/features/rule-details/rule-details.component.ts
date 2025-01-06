import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationRule } from '@models/notification-rule';
import { NotificationService } from '@services/notification.service';
import { TableComponent } from "../../shared/table/table.component";
import { NotificationsListComponent } from "@features/notifications-list/notifications-list.component";
import { CommonModule } from '@angular/common';

/**
 * The RuleDetailsComponent is responsible for displaying the details of a rule and allowing the user to edit it.
 */
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
    // Get the rule id from the route
    var ruleId = this.route.snapshot.paramMap.get('id')!;

    // Fetch the rule
    this.notificationsService.getNotificationRule(ruleId).subscribe(data => {
      this.rule = data;
      this.rule.ruleString = this.createRuleString(this.rule);
    });
  }

  /**
   * Enables editing of the rule.
   */
  edit(): void {
    this.isEditing = true;
    console.log('Edit sensor');
  }

  /**
   * Submits the edited rule.
   */
  submit(): void {
    this.isSubmitting = true;
    this.submitError = false;

    // Empty rule string
    if (this.rule.ruleString == null) {
      this.submitError = true;
      this.isSubmitting = false;
      return;
    }

    // Parse rule string
    var parts = this.rule.ruleString.split(' ');
    // Fit rule string to the rule object
    this.rule.measurement = parts[0];
    this.rule.operator = parts[1];
    this.rule.value = parseFloat(parts[2]);

    // Validate rule string
    if (!this.validRuleString(this.rule.ruleString)) {
      this.submitError = true;
      this.isSubmitting = false;
      return;
    }

    // Update rule
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

  /**
   * Cancels the editing of the rule.
   */
  cancel(): void {
    this.isEditing = false;
    this.submitError = false;
    console.log('Cancel sensor');
  }

  /**
   * Asks the user for confirmation and deletes the rule.
   */
  deleteRule(): void {
    if (!confirm('Vai tiešām vēlaties dzēst šo paziņojuma noteikumu?')) {
      return;
    }

    this.notificationsService.deleteNotificationRule(this.rule.id!).subscribe(() => {
      this.router.navigate(['/notifications/rules']);
    });
  }

  /**
   * Reloads the rule data.
   * @param callback callback to call after the rule has been reloaded.
   */
  private reload(callback: () => void): void {
    this.notificationsService.getNotificationRule(this.rule.id!).subscribe(data => {
      this.rule = data;
      this.rule.ruleString = this.createRuleString(this.rule);

      callback();
    });
  }

  /**
   * Validates a rule string.
   * @param string User input rule string like 'temperature > 20'
   * @returns True if the rule string is valid, false otherwise.
   */
  private validRuleString(string: string): boolean {
    var parts = string.split(' ');

    // Check if the rule string has 3 parts
    if (parts.length != 3) {
      return false;
    }

    // Check if the operator is valid
    if (parts[1] != '>' && parts[1] != '<') {
      return false;
    }

    // Check if the value is a number
    if (isNaN(parseInt(parts[2]))) {
      return false;
    }

    return true;
  }

  /**
   * Creates a rule string from a rule object.
   * @param rule NotificationRule object
   * @returns Rule string like 'temperature > 20'
   */
  private createRuleString(rule: NotificationRule): string {
    return `${rule.measurement} ${rule.operator} ${rule.value}`;
  }
}
