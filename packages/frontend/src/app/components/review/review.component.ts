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
  myReview$!: Observable<IReview>;
  reload$ = new BehaviorSubject(true);
  reloadMyReview$ = new BehaviorSubject(true);

  isReviewModalOpen = false;
  hoveredRating: number = 0;

  reviewForm: FormGroup = this.fb.group({
    rating: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
    description: ['', Validators.maxLength(512)]
  });

  ngOnInit() {
    if (this.serviceId) {
      this.loadReviews();
    }
  }

  setRating(rating: number) {
    this.reviewForm.get('rating')?.setValue(rating);
  }

  loadReviews() {
    this.reviews$ = this.reload$.pipe(
      switchMap(() => this.apiService.getReviewsForService(this.serviceId))
    );
    this.myReview$ = this.reloadMyReview$.pipe(
      switchMap(() => this.apiService.getMyReview(this.serviceId))
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

  deleteReview(reviewId:number){

  }


  openReviewModal(existingReview?: IReview | null) {
    if (existingReview) {
      this.reviewForm.patchValue({
        rating: existingReview.rating,
        description: existingReview.description
      });
    } else {
      this.reviewForm.reset({rating: 1, description: ''});
    }
    this.isReviewModalOpen = true;
  }

  closeReviewModal() {
    this.isReviewModalOpen = false;
    this.reviewForm.reset({rating: 1, description: ''});
  }

  submitReview() {
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
        this.reloadMyReview$.next(true);
      },
      error: (err) => console.error('Грешка при зачувување на рецензија', err)
    });
  }
}
