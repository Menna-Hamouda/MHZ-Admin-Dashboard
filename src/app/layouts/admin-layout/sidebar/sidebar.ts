
import { Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

interface SidebarItem {
  label: string;
  icon: string;
  route: string;
  roles: string[];
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  @Input() isOpen = true;

  @Output() close = new EventEmitter<void>();

  private authService = inject(AuthService);

  readonly currentUser = this.authService.currentUser;

  private readonly allNavItems: SidebarItem[] = [
    {
      label: 'Dashboard',
      icon: '⌂',
      route: '/dashboard',
      roles: ['Admin', 'Manager', 'Employee'],
      exact: true
    },
    {
      label: 'Users',
      icon: '♙',
      route: '/users',
      roles: ['Admin']
    },
    {
      label: 'Products',
      icon: '◇',
      route: '/products',
      roles: ['Admin', 'Manager']
    },
    {
      label: 'Orders',
      icon: '▱',
      route: '/orders',
      roles: ['Admin', 'Manager', 'Employee']
    },
    {
      label: 'Settings',
      icon: '⚙',
      route: '/settings',
      roles: ['Admin']
    }
  ];

  readonly navItems = computed(() => {
    const role = this.currentUser()?.role;

    if (!role) {
      return [];
    }

    return this.allNavItems.filter(item =>
      item.roles.includes(role)
    );
  });

  closeOnMobile(): void {
    this.close.emit();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
