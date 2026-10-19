
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  Order,
  OrderStatus,
  OrdersService
} from '../../../core/services/orders';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css'
})
export class OrderDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly ordersService = inject(OrdersService);

  order: Order | null = null;
  isLoading = true;
  isSavingStatus = false;
  errorMessage = '';
  successMessage = '';
  selectedStatus: OrderStatus | '' = '';

  readonly allStatuses: OrderStatus[] = [
    'Pending',
    'Processing',
    'Shipped',
    'Completed',
    'Cancelled'
  ];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.errorMessage = 'رقم الطلب غير صحيح.';
      this.isLoading = false;
      return;
    }

    this.loadOrder(id);
  }

  loadOrder(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.ordersService.getOrderById(id).subscribe({
      next: order => {
        this.order = order;
        this.selectedStatus = order.status;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage =
          'Could not load this order. Check the order ID and try again.';
        this.isLoading = false;
      }
    });
  }

  get allowedTransitions(): OrderStatus[] {
    if (!this.order) return [];

    return this.ordersService.getAllowedTransitions(this.order.status);
  }

  get canChangeStatus(): boolean {
    return this.allowedTransitions.length > 0;
  }

  getStatusClass(status: OrderStatus): string {
    return status.toLowerCase();
  }

  saveStatus(): void {
    if (!this.order || !this.selectedStatus) return;

    if (this.selectedStatus === this.order.status) {
      return;
    }

    if (!this.allowedTransitions.includes(this.selectedStatus)) {
      this.errorMessage =
        `Transition from ${this.order.status} to ${this.selectedStatus} is not allowed.`;
      this.selectedStatus = this.order.status;
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isSavingStatus = true;

    this.ordersService
      .updateStatus(this.order.id, this.selectedStatus)
      .subscribe({
        next: updatedOrder => {
          this.order = {
            ...this.order!,
            status: updatedOrder.status
          };

          this.selectedStatus = updatedOrder.status;
          this.isSavingStatus = false;
          this.successMessage =
            'Order status updated for this demo session.';
        },
        error: () => {
          this.isSavingStatus = false;
          this.errorMessage =
            'Could not update the order status. Please try again.';
          this.selectedStatus = this.order?.status ?? '';
        }
      });
  }

  cancelStatusChange(): void {
    this.selectedStatus = this.order?.status ?? '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  goBack(): void {
    this.location.back();
  }
}
