
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';

export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Completed'
  | 'Cancelled';

export interface OrderItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  thumbnail: string;
}

export interface OrderCustomer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Order {
  id: number;
  userId: number;
  customer: OrderCustomer;
  products: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  date: string;
  status: OrderStatus;
}

interface ApiCartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  thumbnail: string;
}

interface ApiCart {
  id: number;
  userId: number;
  products: ApiCartProduct[];
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
}

interface CartsResponse {
  carts: ApiCart[];
}

interface ApiUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: {
    address?: string;
    city?: string;
  };
}

interface UsersResponse {
  users: ApiUser[];
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://dummyjson.com';

  private readonly statusByCartId: Record<number, OrderStatus> = {
    1: 'Completed',
    2: 'Pending',
    3: 'Cancelled',
    4: 'Processing',
    5: 'Shipped'
  };

  private readonly localStatuses = new Map<number, OrderStatus>();

  getOrders(): Observable<Order[]> {
    return forkJoin({
      carts: this.http.get<CartsResponse>(
        `${this.baseUrl}/carts?limit=0`
      ),
      users: this.http.get<UsersResponse>(
        `${this.baseUrl}/users?limit=0`
      )
    }).pipe(
      map(({ carts, users }) => {
        const usersById = new Map(
          users.users.map(user => [user.id, user])
        );

        return carts.carts.map(cart =>
          this.mapCartToOrder(cart, usersById.get(cart.userId))
        );
      })
    );
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<ApiCart>(`${this.baseUrl}/carts/${id}`).pipe(
      switchMap(cart =>
        this.http.get<ApiUser>(`${this.baseUrl}/users/${cart.userId}`).pipe(
          map(user => this.mapCartToOrder(cart, user))
        )
      )
    );
  }

  updateStatus(id: number, status: OrderStatus): Observable<Order> {
    // Demo API doesn't persist status changes.
    // This local map keeps changes while the app remains open.
    this.localStatuses.set(id, status);

    return this.getOrderById(id).pipe(
      map(order => ({ ...order, status }))
    );
  }

  getAllowedTransitions(status: OrderStatus): OrderStatus[] {
    const rules: Record<OrderStatus, OrderStatus[]> = {
      Pending: ['Processing', 'Cancelled'],
      Processing: ['Shipped', 'Cancelled'],
      Shipped: ['Completed'],
      Completed: [],
      Cancelled: []
    };

    return rules[status];
  }

  private mapCartToOrder(
    cart: ApiCart,
    user?: ApiUser
  ): Order {
    const products: OrderItem[] = cart.products.map(product => ({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: product.quantity,
      total: product.total,
      thumbnail: product.thumbnail
    }));

    const subtotal = products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );

    const shipping = subtotal > 0 ? 20 : 0;

    const defaultStatuses: OrderStatus[] = [
      'Completed',
      'Pending',
      'Cancelled',
      'Processing',
      'Shipped'
    ];

    const status =
      this.localStatuses.get(cart.id) ??
      this.statusByCartId[cart.id] ??
      defaultStatuses[(cart.id - 1) % defaultStatuses.length];

    const customer: OrderCustomer = {
      id: user?.id ?? cart.userId,
      name: user
        ? `${user.firstName} ${user.lastName}`
        : `Customer ${cart.userId}`,
      email: user?.email ?? 'Not available',
      phone: user?.phone ?? 'Not available',
      address: user?.address
        ? [user.address.address, user.address.city]
            .filter(Boolean)
            .join(', ')
        : 'Not available'
    };

    // DummyJSON carts don't contain an order creation date.
    // This is a stable demo date based on the cart ID.
    const date = new Date(Date.UTC(2026, 8, 18 - ((cart.id - 1) % 14)))
      .toISOString();

    return {
      id: cart.id,
      userId: cart.userId,
      customer,
      products,
      subtotal,
      shipping,
      total: subtotal + shipping,
      date,
      status
    };
  }
}

