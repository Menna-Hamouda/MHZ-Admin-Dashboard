
import { Injectable, computed, signal } from '@angular/core';

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  createdAt: number;
  type: 'warning' | 'success' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private readonly notificationsSignal = signal<AppNotification[]>([
    {
      id: 1,
      title: 'New order #1024',
      message: 'A new order has been received.',
      time: '2 minutes ago',
      read: false,
      createdAt: Date.now() - 2 * 60 * 1000,
      type: 'success'
    },
    {
      id: 2,
      title: 'New user registered',
      message: 'A new user has registered.',
      time: '10 minutes ago',
      read: false,
      createdAt: Date.now() - 10 * 60 * 1000,
      type: 'info'
    },
    {
      id: 3,
      title: 'Product stock is low',
      message: 'One of your products is running low on stock.',
      time: '1 hour ago',
      read: false,
      createdAt: Date.now() - 60 * 60 * 1000,
      type: 'warning'
    }
  ]);

  readonly notifications = this.notificationsSignal.asReadonly();

  readonly unreadCount = computed(
    () => this.notificationsSignal().filter(item => !item.read).length
  );

  markAsRead(id: number): void {
    this.notificationsSignal.update(items =>
      items.map(item =>
        item.id === id ? { ...item, read: true } : item
      )
    );
  }

  markAllAsRead(): void {
    this.notificationsSignal.update(items =>
      items.map(item => ({ ...item, read: true }))
    );
  }

  addNotification(
    title: string,
    message: string,
    type: AppNotification['type'] = 'info'
  ): void {
    const notification: AppNotification = {
      id: Date.now(),
      title,
      message,
      time: 'Just now',
      read: false,
      createdAt: Date.now(),
      type
    };

    this.notificationsSignal.update(items => [
      notification,
      ...items
    ]);
  }
}
