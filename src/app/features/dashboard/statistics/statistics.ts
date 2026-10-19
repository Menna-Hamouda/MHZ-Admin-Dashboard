
import { Component, inject, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Dashboard } from '../../../core/services/dashboard';
@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css'
})
export class Statistics implements OnInit {
  private readonly dashboardService = inject(Dashboard);

  totalUsers: number | null = null;
  totalProducts: number | null = null;

  stats = [
    {
      title: 'Total Users',
      value: '1,250',
      growth: '12%',
      icon: '👥',
      type: 'users'
    },
    {
      title: 'Total Products',
      value: '320',
      growth: '8%',
      icon: '📦',
      type: 'products'
    },
    {
      title: 'Total Orders',
      value: '845',
      growth: '15%',
      icon: '🛒',
      type: 'orders'
    },
    {
      title: 'Revenue',
      value: '$45,200',
      growth: '21%',
      icon: '💰',
      type: 'revenue'
    }
  ];

  ngOnInit(): void {
    this.loadUsersCount();
    this.loadProductsCount();
  }

  private loadUsersCount(): void {
    this.dashboardService.getUsersCount().subscribe({
      next: (response) => {
        this.totalUsers = response.total;
      },
      error: (error) => {
        console.error('Failed to load users count:', error);
      }
    });
  }

  private loadProductsCount(): void {
    this.dashboardService.getProductsCount().subscribe({
      next: (response) => {
        this.totalProducts = response.total;
      },
      error: (error) => {
        console.error('Failed to load products count:', error);
      }
    });
  }
}
