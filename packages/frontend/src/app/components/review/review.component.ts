import { Component, inject, OnInit, Input } from '@angular/core';
import { ApiService } from "../../services/api.service";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { IReview } from "@dnevnica/shared";
import { BehaviorSubject, Observable, switchMap } from "rxjs";
import { AsyncPipe, CommonModule, DatePipe } from "@angular/common";

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    DatePipe,
    CommonModule
  ],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent implements OnInit {
  @Input() serviceId!: number;

  private readonly apiService = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  reviews$!: Observable<IReview[]>;
  myReview$!: Observable<IReview>;
  reload$ = new BehaviorSubject(true);
  reloadMyReview$ = new BehaviorSubject(true);

  isReviewModalOpen = false;
  isDeleteModalOpen = false;
  isEditMode = false;
  currentReviewId: number | null = null;
  reviewToDeleteId: number | null = null;
  activeMenuReviewId: number | null = null;
  hoveredRating: number = 0;

  reviewForm: FormGroup = this.fb.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    description: ['', Validators.maxLength(512)]
  });

  ngOnInit() {
    if (this.serviceId) {
      this.loadReviews();
    }
  }

  loadReviews() {
    this.reviews$ = this.reload$.pipe(
      switchMap(() => this.apiService.getReviewsForService(this.serviceId))
    );
    this.myReview$ = this.reloadMyReview$.pipe(
      switchMap(() => this.apiService.getMyReview(this.serviceId))
    );
  }

  setRating(rating: number) {
    this.reviewForm.get('rating')?.setValue(rating);
  }

  calculateAverage(reviews: IReview[]) {
    if (!reviews || reviews.length === 0) return 0;
    let sum = 0;
    for (let i = 0; i < reviews.length; i++) {
      sum += reviews[i].rating || 0;
    }
    return Number((sum / reviews.length).toFixed(1));
  }

  toggleMenu(reviewId: number, event: Event) {
    event.stopPropagation();
    this.activeMenuReviewId = this.activeMenuReviewId === reviewId ? null : reviewId;
  }

  openReviewModal(existingReview?: IReview | null) {
    this.activeMenuReviewId = null;
    if (existingReview) {
      this.isEditMode = true;
      this.currentReviewId = existingReview.id ?? null;
      this.reviewForm.patchValue({
        rating: existingReview.rating,
        description: existingReview.description
      });
    } else {
      this.isEditMode = false;
      this.currentReviewId = null;
      this.reviewForm.reset({ rating: 5, description: '' });
    }
    this.isReviewModalOpen = true;
  }

  closeReviewModal() {
    this.isReviewModalOpen = false;
    this.isEditMode = false;
    this.currentReviewId = null;
    this.reviewForm.reset({ rating: 5, description: '' });
  }

  submitReview() {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const payload = {
      rating: Number(this.reviewForm.value.rating),
      description: this.reviewForm.value.description || '',
      serviceId: this.serviceId
    } as IReview;

    if (this.isEditMode && this.currentReviewId) {
      this.apiService.updateReview(this.currentReviewId, payload).subscribe({
        next: () => {
          this.closeReviewModal();
          this.reload$.next(true);
          this.reloadMyReview$.next(true);
        },
        error: (err) => console.error('Грешка при ажурирање', err)
      });
    } else {
      this.apiService.createReview(payload).subscribe({
        next: () => {
          this.closeReviewModal();
          this.reload$.next(true);
          this.reloadMyReview$.next(true);
        },
        error: (err) => console.error('Грешка при зачувување', err)
      });
    }
  }

  openDeleteModal(reviewId: number) {
    this.activeMenuReviewId = null;
    this.reviewToDeleteId = reviewId;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.reviewToDeleteId = null;
  }

  confirmDelete() {
    if (this.reviewToDeleteId !== null) {
      this.apiService.deleteReview(this.reviewToDeleteId).subscribe({
        next: () => {
          this.closeDeleteModal();
          this.reload$.next(true);
          this.reloadMyReview$.next(true);
        },
        error: (err) => console.error('Грешка при бришење', err)
      });
    }
  }
}
