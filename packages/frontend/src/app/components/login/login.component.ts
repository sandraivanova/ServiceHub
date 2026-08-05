import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    const {email, password} = this.loginForm.value;

    this.http.post<any>('http://localhost:3000/api/auth/login', {email, password})
      .subscribe({
        next: (response) => {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);

          if (response.firstName) {
            localStorage.setItem('userName', response.firstName);
          }

          this.router.navigate(['/home']).then(() => {
            window.location.reload();
          });
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Login error';
        }
      })

  }
}
