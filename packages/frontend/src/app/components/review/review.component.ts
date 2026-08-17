import {Component, inject, OnInit, Input} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {IReview} from "@dnevnica/shared";
import {BehaviorSubject, combineLatestWith, map, Observable, retryWhen, switchMap} from "rxjs";
import {AsyncPipe, CommonModule, DatePipe} from "@angular/common";

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
  reload$ = new BehaviorSubject(true);

  isReviewModalOpen = false;

  reviewForm: FormGroup = this.fb.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    description: ['']
  });

  ngOnInit(): void {
    if (this.serviceId) {
      this.loadReviews();
    }
  }

  hoveredRating: number = 0;

  setRating(rating: number): void {
    this.reviewForm.get('rating')?.setValue(rating);
  }

  loadReviews(): void {
    this.reviews$ = this.reload$.pipe(
      switchMap(() => this.apiService.getReviewsForService(this.serviceId))
    );
  }

  calculateAverage(reviews: IReview[]) {
    if (!reviews || reviews.length === 0) return 0;

    let sum = 0;
    for (let i = 0; i < reviews.length; i++) {
      sum += reviews[i].rating || 0;
    }

    return Number((sum / reviews.length).toFixed(1));
  }


  openReviewModal() {
    this.apiService.getMyReview(this.serviceId).subscribe({
      next: (existingReview: IReview | null) => {
        if (existingReview) {
          this.reviewForm.patchValue({
            rating: existingReview.rating,
            description: existingReview.description
          });
        } else {
          this.reviewForm.reset({ rating: 5, description: '' });
        }
        this.isReviewModalOpen = true;
      },
      error: () => {
        this.reviewForm.reset({ rating: 5, description: '' });
        this.isReviewModalOpen = true;
      }
    });
  }

  closeReviewModal() {
    this.isReviewModalOpen = false;
    this.reviewForm.reset({rating: 5, description: ''});
  }

  submitReview(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    if (!this.reviewForm.value.rating) {
      return;
    }

    const payload = {
      rating: Number(this.reviewForm.value.rating),
      description: this.reviewForm.value.description || '',
      serviceId: this.serviceId
    } as IReview;

    this.apiService.createReview(payload).subscribe({
      next: () => {
        this.closeReviewModal();
        this.reload$.next(true);
      },
      error: (err) => console.error('Грешка при зачувување на рецензија', err)
    });
  }
}
