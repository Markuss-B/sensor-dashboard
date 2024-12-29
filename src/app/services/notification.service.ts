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

  // Notifications
  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}`);
  }

  acknowledgeNotification(notificationId: string): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiUrl}/${notificationId}/acknowledge`, null);
  }

  // Notification rules
  getNotificationRules(): Observable<NotificationRule[]> {
    return this.http.get<NotificationRule[]>(`${this.apiUrl}/rules`);
  }

  getNotificationRule(ruleId: string): Observable<NotificationRule> {
    return this.http.get<NotificationRule>(`${this.apiUrl}/rules/${ruleId}`);
  }

  createNotificationRule(rule: NotificationRule): Observable<any> {
    return this.http.post(`${this.apiUrl}/rules/new`, rule);
  }

  deleteNotificationRule(ruleId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/rules/${ruleId}`);
  }

  updateNotificationRule(rule: NotificationRule): Observable<NotificationRule> {
    return this.http.put<NotificationRule>(`${this.apiUrl}/rules`, rule);
  }
}
