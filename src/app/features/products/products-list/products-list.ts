
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  Product,
  ProductsService
} from '../../../core/services/products';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css'
})
export class ProductsList implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly router = inject(Router);

  products: Product[] = [];
  searchTerm = '';
  selectedCategory = 'all';
  selectedStock = 'all';
  sortBy = 'default';

  isLoading = true;
  errorMessage = '';
  successMessage = '';
  productToDelete: Product | null = null;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'حصل خطأ أثناء تحميل المنتجات. حاولي مرة تانية.';
        this.isLoading = false;
      }
    });
  }

  get categories(): string[] {
    return [...new Set(this.products.map(p => p.category))].sort();
  }

  get filteredProducts(): Product[] {
    let result = [...this.products];

    const term = this.searchTerm.trim().toLowerCase();

    if (term) {
      result = result.filter(product =>
        product.title.toLowerCase().includes(term) ||
        product.brand?.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      );
    }

    if (this.selectedCategory !== 'all') {
      result = result.filter(
        product => product.category === this.selectedCategory
      );
    }

    if (this.selectedStock === 'in') {
      result = result.filter(product => product.stock > 10);
    } else if (this.selectedStock === 'low') {
      result = result.filter(
        product => product.stock > 0 && product.stock <= 10
      );
    } else if (this.selectedStock === 'out') {
      result = result.filter(product => product.stock <= 0);
    }

    switch (this.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-az':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-za':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return result;
  }

  get totalProducts(): number {
    return this.products.length;
  }

  get lowStockCount(): number {
    return this.products.filter(
      product => product.stock > 0 && product.stock <= 10
    ).length;
  }

  get outOfStockCount(): number {
    return this.products.filter(product => product.stock <= 0).length;
  }

  get totalInventoryValue(): number {
    return this.products.reduce(
      (total, product) => total + product.price * product.stock,
      0
    );
  }

  getStockLabel(stock: number): string {
    if (stock <= 0) return 'Out of stock';
    if (stock <= 10) return 'Low stock';
    return 'In stock';
  }

  getStockClass(stock: number): string {
    if (stock <= 0) return 'stock-out';
    if (stock <= 10) return 'stock-low';
    return 'stock-in';
  }

  viewProduct(id: number): void {
    this.router.navigate(['/products', id]);
  }

  editProduct(id: number): void {
    this.router.navigate(['/products', id, 'edit']);
  }

  confirmDelete(product: Product): void {
    this.productToDelete = product;
  }

  cancelDelete(): void {
    this.productToDelete = null;
  }

  deleteProduct(): void {
    if (!this.productToDelete) return;

    const id = this.productToDelete.id;

    this.productsService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(product => product.id !== id);
        this.successMessage = 'تم حذف المنتج من القائمة بنجاح.';
        this.productToDelete = null;

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: () => {
        this.errorMessage = 'تعذر حذف المنتج. حاولي مرة تانية.';
        this.productToDelete = null;
      }
    });
  }

  trackById(_index: number, product: Product): number {
    return product.id;
  }
}
