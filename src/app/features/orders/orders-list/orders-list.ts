
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  Order,
  OrderStatus,
  OrdersService
} from '../../../core/services/orders';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './orders-list.html',
  styleUrl: './orders-list.css'
})
export class OrdersList implements OnInit {
  private readonly ordersService = inject(OrdersService);

  orders: Order[] = [];
  searchTerm = '';
  selectedStatus = 'All';
  selectedDate = 'All';
  isLoading = true;
  errorMessage = '';

  readonly statuses: OrderStatus[] = [
    'Pending',
    'Processing',
    'Shipped',
    'Completed',
    'Cancelled'
  ];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.ordersService.getOrders().subscribe({
      next: orders => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage =
          'Could not load orders. Please try again.';
        this.isLoading = false;
      }
    });
  }

  get filteredOrders(): Order[] {
    let result = [...this.orders];
    const term = this.searchTerm.trim().toLowerCase();

    if (term) {
      result = result.filter(order =>
        String(order.id).includes(term) ||
        order.customer.name.toLowerCase().includes(term) ||
        order.customer.email.toLowerCase().includes(term)
      );
    }

    if (this.selectedStatus !== 'All') {
      result = result.filter(
        order => order.status === this.selectedStatus
      );
    }

    const now = new Date();

    if (this.selectedDate === 'Today') {
      result = result.filter(order =>
        this.isSameDay(new Date(order.date), now)
      );
    } else if (this.selectedDate === 'This Week') {
      const startOfWeek = new Date(now);
      const day = (now.getDay() + 6) % 7;
      startOfWeek.setDate(now.getDate() - day);
      startOfWeek.setHours(0, 0, 0, 0);

      result = result.filter(order => {
        const date = new Date(order.date);
        return date >= startOfWeek && date <= now;
      });
    } else if (this.selectedDate === 'This Month') {
      result = result.filter(order => {
        const date = new Date(order.date);
        return date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear();
      });
    }

    return result.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  get totalRevenue(): number {
    return this.orders
      .filter(order => order.status !== 'Cancelled')
      .reduce((sum, order) => sum + order.total, 0);
  }

  get pendingCount(): number {
    return this.orders.filter(
      order => order.status === 'Pending'
    ).length;
  }

  get completedCount(): number {
    return this.orders.filter(
      order => order.status === 'Completed'
    ).length;
  }

  getStatusClass(status: OrderStatus): string {
    return status.toLowerCase();
  }

  formatOrderId(id: number): string {
    return `#${id}`;
  }

  private isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  }

  trackByOrderId(_index: number, order: Order): number {
    return order.id;
  }
}

