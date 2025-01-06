import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationRule } from '@models/notification-rule';
import { NotificationService } from '@services/notification.service';

/**
 * The RuleCreateComponent is responsible for creating a new rule.
 */
@Component({
  selector: 'app-rule-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rule-create.component.html',
  styleUrl: './rule-create.component.scss'
})
export class RuleCreateComponent {
  constructor(
    private notificationsService: NotificationService,
    private router: Router
  ) { }

  // Initialize an empty rule with template values
  rule: NotificationRule = {
    id: '',
    name: '',
    sensorId: '',
    measurement: 'co2',
    operator: '>',
    value: 900,
    ruleString: 'co2 > 900',
    notifications: []
  }

  isSubmitting: boolean = false;
  submitError: boolean = false;

  /**
   * Submits the new rule.
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
    
    // Check if the rule string is valid
    if (!this.validRuleString(this.rule.ruleString)) {
      this.submitError = true;
      this.isSubmitting = false;
      return;
    }
    
    // Fit the rule string into the rule object
    var parts = this.rule.ruleString.split(' ');
    this.rule.measurement = parts[0];
    this.rule.operator = parts[1];
    this.rule.value = parseFloat(parts[2]);

    // Create the rule
    this.notificationsService.createNotificationRule(this.rule)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/notifications/rules', res.id]);
        },
        error: (error) => {
          this.submitError = true;
          this.isSubmitting = false;
          console.error('Error rule sensor', error);
        }
      });
  }

    /**
   * Validates a rule string.
   * @param string User input rule string like 'temperature > 20'
   * @returns True if the rule string is valid, false otherwise.
   */
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

}
