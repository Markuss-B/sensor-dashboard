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
  private apiUrl = environment.apiUrl + '/api/notification';
  
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

  createNotificationRule(rule: NotificationRule): Observable<NotificationRule> {
    return this.http.post<NotificationRule>(`${this.apiUrl}/rules`, rule);
  }

  deleteNotificationRule(ruleId: string): Observable<NotificationRule> {
    return this.http.delete<NotificationRule>(`${this.apiUrl}/rules/${ruleId}`);
  }

  updateNotificationRule(rule: NotificationRule): Observable<NotificationRule> {
    return this.http.put<NotificationRule>(`${this.apiUrl}/rules`, rule);
  }
}
