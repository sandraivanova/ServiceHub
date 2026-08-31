import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private apiService = inject(ApiService);

  errorMessage: string = '';
  message: string='';
  isLoading: boolean=false;


  forgotForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit() {
    if (this.forgotForm.invalid) {
      return;
    }

    const email = this.forgotForm.get('email')?.value!;

    this.apiService.forgotPassword(email).subscribe({
      next: (response) => {
        this.message = response.message;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'error';
      }
    })

  }



}
