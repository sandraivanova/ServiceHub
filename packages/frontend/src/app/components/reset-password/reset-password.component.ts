import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);

  message: string = '';
  isSuccess: boolean = false;
  isLoading: boolean = false;
  token: string = '';

  resetForm = this.fb.group({
    newPassword: ['', [
      Validators.required,
      Validators.minLength(6)
    ]]
  });

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.message = 'Invalid or missing reset token.';
    }
  }

  onSubmit(): void {
    if (this.resetForm.invalid || !this.token) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.message = '';

    const newPassword = this.resetForm.get('newPassword')?.value!;

    this.apiService.resetPassword(this.token, newPassword).subscribe({
      next: (response) => {
        this.message = response.message;
        this.isSuccess = true;
        this.isLoading = false;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },

      error: (err) => {
        this.message = err.error?.message || 'Failed to reset password.';
        this.isSuccess = false;
        this.isLoading = false;
      }
    });
  }
}
