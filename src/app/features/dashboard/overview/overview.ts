import { Component } from '@angular/core';
import { Statistics } from '../statistics/statistics';
import { Charts } from '../charts/charts';
import { RecentOrders } from '../recent-orders/recent-orders';
@Component({
  selector: 'app-overview',
  imports: [Statistics, Charts, RecentOrders],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
})
export class Overview {

}
