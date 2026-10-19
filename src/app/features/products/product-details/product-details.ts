
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import {
  Product,
  ProductsService
} from '../../../core/services/products';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly productsService = inject(ProductsService);

  product: Product | null = null;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.errorMessage = 'رقم المنتج غير صحيح.';
      this.isLoading = false;
      return;
    }

    this.productsService.getProductById(id).subscribe({
      next: product => {
        this.product = product;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'لم نتمكن من تحميل تفاصيل المنتج.';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  get stockLabel(): string {
    if (!this.product) return '';
    if (this.product.stock <= 0) return 'Out of stock';
    if (this.product.stock <= 10) return 'Low stock';
    return 'In stock';
  }

  get stockClass(): string {
    if (!this.product) return '';
    if (this.product.stock <= 0) return 'stock-out';
    if (this.product.stock <= 10) return 'stock-low';
    return 'stock-in';
  }
}
