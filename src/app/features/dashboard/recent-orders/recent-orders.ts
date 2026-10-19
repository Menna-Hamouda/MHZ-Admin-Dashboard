
import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

interface RecentOrder {
  id: string;
  customer: string;
  total: number;
  status: 'Completed' | 'Pending' | 'Processing';
}

@Component({
  selector: 'app-recent-orders',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './recent-orders.html',
  styleUrl: './recent-orders.css'
})
export class RecentOrders {
  orders: RecentOrder[] = [
    {
      id: '#1024',
      customer: 'Ahmed Ali',
      total: 250,
      status: 'Completed'
    },
    {
      id: '#1023',
      customer: 'Sara Ahmed',
      total: 120,
      status: 'Pending'
    },
    {
      id: '#1022',
      customer: 'Omar Ali',
      total: 560,
      status: 'Processing'
    }
  ];
}
