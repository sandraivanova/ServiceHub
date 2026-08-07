import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {Observable} from "rxjs";
import {IUser} from "@dnevnica/shared";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  user$!: Observable<IUser | null>;

  constructor(private router: Router, private apiService: ApiService) {
  }

  ngOnInit() {
    this.user$ = this.apiService.getCurrentUser();
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.isLoggedIn = false;
    this.router.navigate(['/home']);
  }
}
