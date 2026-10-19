import { Injectable , inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class Dashboard {
  private http=inject(HttpClient);
  private usersUrl = 'https://dummyjson.com/users';
  private productsUrl = 'https://dummyjson.com/products';
    getUsersCount(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(
      `${this.usersUrl}?limit=1`
    );
  }

  getProductsCount(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(
      `${this.productsUrl}?limit=1`
    );
  }
  
}
