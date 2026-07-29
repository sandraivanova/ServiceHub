import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {CommonModule} from "@angular/common";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {
  message = 'Loading';
  private http = inject(HttpClient);


  ngOnInit() {
    this.http.get<{ message: string }>('http://localhost:3000/api/test')
      .subscribe({
        next: (response) => {
          this.message = response.message;
        },
        error: (err) => {
          console.error('Eroror', err);
          this.message = 'Failed.';
        }
      });
  }
}
