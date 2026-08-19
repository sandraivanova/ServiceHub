import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';
import {
  CATEGORY_LABELS,
  IGivingService, Location,
  LOCATION_LABELS,
  PRICE_UNIT_LABELS,
  PriceUnit,
  ServiceCategory
} from "@dnevnica/shared";
import {ReviewComponent} from "../review/review.component";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-giving-service-detail',
  standalone: true,
  imports: [CommonModule, ReviewComponent, FormsModule],
  templateUrl: './giving-service-detail.component.html',
  styleUrls: ['./giving-service-detail.component.scss']
})
export class GivingServiceDetailComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);

  service$!: Observable<IGivingService>;

  priceUnitLabels = PRICE_UNIT_LABELS;
  categoryLabels=CATEGORY_LABELS;
  locationLabels= LOCATION_LABELS;

  priceUnits = Object.values(PriceUnit);
  categories = Object.values(ServiceCategory);
  locations = Object.values(Location);


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service$ = this.apiService.findOne(+id);
    }
  }
}
