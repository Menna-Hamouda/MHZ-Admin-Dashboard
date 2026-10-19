import { Component, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './sidebar/sidebar';
import { Topbar } from './topbar/topbar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    Sidebar,
    Topbar
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {

  private readonly mobileBreakpoint = 768;

  readonly isMobile = signal(
    typeof window !== 'undefined' &&
    window.innerWidth <= this.mobileBreakpoint
  );

  readonly isSidebarOpen = signal(!this.isMobile());

  toggleSidebar(): void {
    this.isSidebarOpen.update(isOpen => !isOpen);
  }

  closeSidebar(): void {
    if (this.isMobile()) {
      this.isSidebarOpen.set(false);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    const mobile =
      window.innerWidth <= this.mobileBreakpoint;

    if (mobile !== this.isMobile()) {
      this.isMobile.set(mobile);

      
      this.isSidebarOpen.set(!mobile);
    }
  }
}