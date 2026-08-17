import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';
import {IGivingService} from "@dnevnica/shared";
import {ReviewComponent} from "../review/review.component";

@Component({
  selector: 'app-giving-service-detail',
  standalone: true,
  imports: [CommonModule, ReviewComponent],
  templateUrl: './giving-service-detail.component.html',
  styleUrls: ['./giving-service-detail.component.scss']
})
export class GivingServiceDetailComponent implements OnInit {
  service$!: Observable<IGivingService>;

  private readonly route = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service$ = this.apiService.findOne(+id);
    }
  }
}
