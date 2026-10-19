
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  Product,
  ProductPayload,
  ProductsService
} from '../../../core/services/products';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly productsService = inject(ProductsService);

  productId: number | null = null;
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  imagePreview = '';
  private localImageUrl = '';

  readonly categoryOptions = [
    { value: 'beauty', label: 'Beauty' },
    { value: 'fragrances', label: 'Fragrances' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'groceries', label: 'Groceries' },
    { value: 'home-decoration', label: 'Home Decoration' },
    { value: 'kitchen-accessories', label: 'Kitchen Accessories' },
    { value: 'laptops', label: 'Laptops' },
    { value: 'mens-shirts', label: "Men's Shirts" },
    { value: 'mens-shoes', label: "Men's Shoes" },
    { value: 'mens-watches', label: "Men's Watches" },
    { value: 'mobile-accessories', label: 'Mobile Accessories' },
    { value: 'motorcycle', label: 'Motorcycle' },
    { value: 'skin-care', label: 'Skin Care' },
    { value: 'smartphones', label: 'Smartphones' },
    { value: 'sports-accessories', label: 'Sports Accessories' },
    { value: 'sunglasses', label: 'Sunglasses' },
    { value: 'tablets', label: 'Tablets' },
    { value: 'tops', label: 'Tops' },
    { value: 'vehicle', label: 'Vehicle' },
    { value: 'womens-bags', label: "Women's Bags" },
    { value: 'womens-dresses', label: "Women's Dresses" },
    { value: 'womens-jewellery', label: "Women's Jewellery" },
    { value: 'womens-shoes', label: "Women's Shoes" },
    { value: 'womens-watches', label: "Women's Watches" }
  ];

  formData: ProductPayload = this.getEmptyForm();

  ngOnInit(): void {
    const idValue = this.route.snapshot.paramMap.get('id');

    if (idValue) {
      const id = Number(idValue);

      if (!Number.isInteger(id) || id <= 0) {
        this.errorMessage = 'رقم المنتج غير صحيح.';
        return;
      }

      this.productId = id;
      this.isEditMode = true;
      this.loadProduct(id);
    } else {
      this.imagePreview = '';
    }
  }

  ngOnDestroy(): void {
    this.releaseLocalImageUrl();
  }

  private getEmptyForm(): ProductPayload {
    return {
      title: '',
      description: '',
      category: '',
      price: 0,
      discountPercentage: 0,
      stock: 0,
      brand: '',
      thumbnail: ''
    };
  }

  private loadProduct(id: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productsService.getProductById(id).subscribe({
      next: (product: Product) => {
        this.formData = {
          title: product.title ?? '',
          description: product.description ?? '',
          category: product.category ?? '',
          price: product.price ?? 0,
          discountPercentage: product.discountPercentage ?? 0,
          stock: product.stock ?? 0,
          brand: product.brand ?? '',
          thumbnail: product.thumbnail ?? ''
        };

        this.imagePreview = this.formData.thumbnail;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'تعذر تحميل بيانات المنتج.';
        this.isLoading = false;
      }
    });
  }

  onImageUrlChange(value: string): void {
    this.formData.thumbnail = value.trim();
    this.releaseLocalImageUrl();
    this.imagePreview = this.formData.thumbnail;
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'اختاري ملف صورة صالح.';
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'حجم الصورة لازم يكون أقل من 5 ميجابايت.';
      input.value = '';
      return;
    }

    this.errorMessage = '';
    this.releaseLocalImageUrl();

    this.localImageUrl = URL.createObjectURL(file);
    this.imagePreview = this.localImageUrl;

    // DummyJSON does not host uploaded files.
    // Keep the selected image as a local preview only.
  }

  private releaseLocalImageUrl(): void {
    if (this.localImageUrl) {
      URL.revokeObjectURL(this.localImageUrl);
      this.localImageUrl = '';
    }
  }

  onSubmit(form: NgForm): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (form.invalid) {
      form.control.markAllAsTouched();
      this.errorMessage = 'راجعي الحقول المطلوبة قبل الحفظ.';
      return;
    }

    if (this.formData.price < 0 || this.formData.stock < 0) {
      this.errorMessage = 'السعر والمخزون لا يمكن أن يكونا أقل من صفر.';
      return;
    }

    if (
      this.formData.discountPercentage < 0 ||
      this.formData.discountPercentage > 100
    ) {
      this.errorMessage = 'الخصم لازم يكون بين 0 و100.';
      return;
    }

    const payload: ProductPayload = {
      title: this.formData.title.trim(),
      description: this.formData.description.trim(),
      category: this.formData.category,
      price: Number(this.formData.price),
      discountPercentage: Number(this.formData.discountPercentage),
      stock: Number(this.formData.stock),
      brand: this.formData.brand.trim(),
      thumbnail: this.formData.thumbnail.trim()
    };

    this.isSaving = true;

    if (this.isEditMode && this.productId !== null) {
      this.productsService.updateProduct(this.productId, payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/products', this.productId], {
            state: { message: 'تم إرسال التعديلات بنجاح.' }
          });
        },
        error: () => {
          this.isSaving = false;
          this.errorMessage = 'تعذر تعديل المنتج. حاولي مرة تانية.';
        }
      });
    } else {
      this.productsService.createProduct(payload).subscribe({
        next: (createdProduct) => {
          this.isSaving = false;
          this.router.navigate(['/products'], {
            state: {
              message: `تم إرسال طلب إضافة المنتج: ${createdProduct.title}`
            }
          });
        },
        error: () => {
          this.isSaving = false;
          this.errorMessage = 'تعذر إضافة المنتج. حاولي مرة تانية.';
        }
      });
    }
  }

  cancel(): void {
    if (this.isEditMode && this.productId !== null) {
      this.router.navigate(['/products', this.productId]);
    } else {
      this.location.back();
    }
  }
}

