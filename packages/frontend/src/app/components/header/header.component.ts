import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  userName: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.isLoggedIn = true;
      this.userName = localStorage.getItem('userName') || '';
    } else {
      this.isLoggedIn = false;
    }
  }

  // Функција за одјава
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userName'); // Бришење и на името при одјава
    this.isLoggedIn = false;
    this.router.navigate(['/home']); // Те носи на почетна (или /login)
  }
}
