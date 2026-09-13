import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {IUser} from "@dnevnica/shared";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);

  profileForm!: FormGroup;
  currentUserId!: number;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      avatarUrl: [''],
      skills: ['']
    });

    this.apiService.getCurrentUser().subscribe({
      next: (user: any) => {
        this.currentUserId = user.id;

        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
      },
      error: (err) => {
        console.error('Error loading user', err);
        this.errorMessage = 'Неуспешно вчитување на податоците за профилот.';
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid || !this.currentUserId) return;

    const formValues = this.profileForm.value;

    const payload: Partial<IUser> = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      };

    this.apiService.updateCurrentUser(this.currentUserId, payload).subscribe({
      next: () => {
        this.successMessage = 'Профилот е успешно ажуриран!';
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Error updating user', err);
        this.errorMessage = 'Грешка при зачувување на промените.';
        this.successMessage = '';
      }
    });
  }
}
