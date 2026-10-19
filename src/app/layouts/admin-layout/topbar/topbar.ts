import {
  Component,
  EventEmitter,
  Output,
  signal,
  computed,
  HostListener,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth';
import { NotificationsService } from '../../../core/services/notifications';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css'
})
export class Topbar {
  @Output() menuToggle = new EventEmitter<void>();

  private authService = inject(AuthService);
  private notificationsService = inject(NotificationsService);
  private router = inject(Router);

  readonly isNotificationsOpen = signal(false);
  readonly isUserMenuOpen = signal(false);
  readonly isLogoutModalOpen = signal(false);

  // بيانات المستخدم الحالي من AuthService
  readonly currentUser = this.authService.currentUser;

  // الإشعارات من NotificationsService
  readonly notifications = this.notificationsService.notifications;

  readonly unreadCount = computed(
    () => this.notifications().filter(notification => !notification.read).length
  );

  toggleMenu(): void {
    this.menuToggle.emit();
  }

  toggleNotifications(): void {
    this.isNotificationsOpen.update(isOpen => !isOpen);

    if (this.isNotificationsOpen()) {
      this.isUserMenuOpen.set(false);
    }
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen.update(isOpen => !isOpen);

    if (this.isUserMenuOpen()) {
      this.isNotificationsOpen.set(false);
    }
  }

  closeDropdowns(): void {
    this.isNotificationsOpen.set(false);
    this.isUserMenuOpen.set(false);
  }

  markAllAsRead(): void {
    this.notificationsService.markAllAsRead();
  }

  markAsRead(notificationId: number | string): void {
    this.notificationsService.markAsRead(Number(notificationId));
  }

  openProfile(): void {
    this.closeDropdowns();
    this.router.navigate(['/settings'], {
      queryParams: { tab: 'profile' }
    });
  }

  openSettings(): void {
    this.closeDropdowns();
    this.router.navigate(['/settings']);
  }

  openNotifications(): void {
    this.closeDropdowns();
    this.router.navigate(['/notifications']);
  }

  openLogoutModal(): void {
    this.closeDropdowns();
    this.isLogoutModalOpen.set(true);
  }

  closeLogoutModal(): void {
    this.isLogoutModalOpen.set(false);
  }

  confirmLogout(): void {
    this.closeLogoutModal();
    this.authService.logout();
  }

  // إغلاق القوائم عند الضغط على زر Escape
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeDropdowns();
    this.closeLogoutModal();
  }

  // الاسم المعروض في الـ Topbar
  get displayName(): string {
    const user = this.currentUser();

    if (!user) {
      return 'User';
    }

    return user.name || user.email || 'User';
  }

  // أول حرف من اسم المستخدم
  get avatarLetter(): string {
    return this.displayName.charAt(0).toUpperCase();
  }

  // الدور الحالي
  get displayRole(): string {
    return this.currentUser()?.role || 'Employee';
  }
}