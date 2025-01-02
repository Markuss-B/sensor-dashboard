import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification';
import { NotificationRule } from '@models/notification-rule';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = environment.apiUrl + '/api/notifications';
  
  constructor(private http: HttpClient) { }

  /**
   * Fetches all notifications.
   */
  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}`);
  }
  
  /**
   * Fetches a notification by its id.
   * @param notificationId 
   */
  getNotificationRules(): Observable<NotificationRule[]> {
    return this.http.get<NotificationRule[]>(`${this.apiUrl}/rules`);
  }

  /**
   * Fetches a notification rule by its id.
   * @param ruleId 
   */
  getNotificationRule(ruleId: string): Observable<NotificationRule> {
    return this.http.get<NotificationRule>(`${this.apiUrl}/rules/${ruleId}`);
  }

  /**
   * Creates a new notification rule.
   * @param rule 
   */
  createNotificationRule(rule: NotificationRule): Observable<any> {
    return this.http.post(`${this.apiUrl}/rules/new`, rule);
  }

  /**
   * Deletes a notification rule by its id.
   * @param ruleId 
   */
  deleteNotificationRule(ruleId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/rules/${ruleId}`);
  }

  /**
   * Updates a notification rule.
   * @param rule 
   */
  updateNotificationRule(rule: NotificationRule): Observable<NotificationRule> {
    return this.http.put<NotificationRule>(`${this.apiUrl}/rules`, rule);
  }
}
