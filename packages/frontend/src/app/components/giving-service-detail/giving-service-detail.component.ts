import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service'; // Прилагодете ја патеката до вашиот сервис

@Component({
  selector: 'app-giving-service-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './giving-service-detail.component.html',
  styleUrls: ['./giving-service-detail.component.scss']
})
export class GivingServiceDetailComponent implements OnInit {
  service: any = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchServiceDetail(+id);
    }
  }

  fetchServiceDetail(id: number): void {
    this.apiService.findOne(id).subscribe({
      next: (data) => {
        this.service = data;
      },
      error: (err) => {
        console.error('error while loading', err);
      }
    });
  }
}
