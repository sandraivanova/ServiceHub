import {Component, inject, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {
  CATEGORY_LABELS,
  IGivingService,
  Location, LOCATION_LABELS,
  PRICE_UNIT_LABELS,
  PriceUnit,
  ServiceCategory
} from "@dnevnica/shared";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import {Observable} from "rxjs";
import {ServiceFilterComponent} from '../service-filter/service-filter.component';

@Component({
  selector: 'app-giving-services',
  standalone: true,
  imports: [
    FormsModule, CommonModule, RouterLink, ServiceFilterComponent, ReactiveFormsModule
  ],
  templateUrl: './giving-services.component.html',
  styleUrl: './giving-services.component.scss'
})
export class GivingServicesComponent implements OnInit {

  private readonly apiService = inject(ApiService)
  private readonly fb = inject(FormBuilder);

  services$!: Observable<IGivingService[]>
  isModalOpen = false;

  priceUnitLabels = PRICE_UNIT_LABELS;
  categoryLabels=CATEGORY_LABELS;
  locationLabels= LOCATION_LABELS;

  priceUnits = Object.values(PriceUnit);
  categories = Object.values(ServiceCategory);
  locations = Object.values(Location);

  serviceForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    priceUnit: [PriceUnit.HOUR, Validators.required],
    category: [ServiceCategory.OTHER, Validators.required],
    yearsOfExperience: [1, [Validators.required, Validators.min(0)]],
    availability: [''],
    phone: ['', Validators.required],
    location: [Location.KOCANI, Validators.required],
    description: ['', Validators.required],
    imageUrl: ['']
  });

  ngOnInit(): void {
    this.services$ = this.apiService.getAllGivingServices()
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  createService() {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    this.apiService.create(this.serviceForm.value).subscribe({
      next: (res) => {
        this.services$ = this.apiService.getAllGivingServices();
        this.closeModal()
      },
      error: (err) => console.error('Error while creating', err)
    });
  }

  onApplyFilter(filters: { searchTerm: string; category: string; location: string }) {
    this.services$ = this.apiService.getAllGivingServices({
      search: filters.searchTerm,
      category: filters.category,
      location: filters.location
    });
  }
}
