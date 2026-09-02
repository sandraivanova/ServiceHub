import {Component, inject, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {
  CATEGORY_LABELS,
  Location,
  LOCATION_LABELS,
  PRICE_UNIT_LABELS,
  URGENCY_LABELS,
  PriceUnit,
  ServiceCategory, Urgency
} from "@dnevnica/shared";
import {
  IServiceRequest,
  SERVICE_MODE_LABELS,
  ServiceMode,
  TIME_PREFERENCE_LABELS,
  TimePreference
} from "@dnevnica/shared/models/service_request";
import {ServiceFilterComponent} from "../service-filter/service-filter.component";
import {RouterLink} from "@angular/router";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-service-request',
  standalone: true,
  imports: [
    ServiceFilterComponent,
    ReactiveFormsModule,
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './service-request.component.html',
  styleUrl: './service-request.component.scss'
})
export class ServiceRequestComponent implements OnInit{

  private readonly apiService = inject(ApiService)
  private readonly fb = inject(FormBuilder);

  services$!: Observable<IServiceRequest[]>
  isModalOpen = false;

  priceUnitLabels = PRICE_UNIT_LABELS;
  categoryLabels = CATEGORY_LABELS;
  locationLabels = LOCATION_LABELS;
  timePreferenceLabels = TIME_PREFERENCE_LABELS;
  serviceModeLabels = SERVICE_MODE_LABELS;
  urgencyLabels=URGENCY_LABELS

  priceUnits = Object.values(PriceUnit);
  categories = Object.values(ServiceCategory);
  locations = Object.values(Location);
  urgencies = Object.values(Urgency);
  serviceModes = Object.values(ServiceMode);
  timePreferences = Object.values(TimePreference);

  serviceForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    price: [null, [Validators.min(0)]],
    priceUnit: [null],
    category: [ServiceCategory.OTHER, Validators.required],
    urgency: [Urgency.NORMAL, Validators.required],
    serviceMode: [ServiceMode.IN_PERSON, Validators.required],
    location: [Location.KOCANI, Validators.required],
    description: ['', Validators.required],
    yearsOfExperience: [null, [Validators.min(0)]],
    imageUrl: [''],
    phone: ['', Validators.required],
    timePreference: [null],
    duration: [''],
    deadline: [null]
  });

  ngOnInit(): void {
    this.services$ = this.apiService.getAllServiceRequests()
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  createServiceRequest() {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    this.apiService.createServiceRequest(this.serviceForm.value).subscribe({
      next: (res) => {
        this.services$ = this.apiService.getAllServiceRequests();
        this.closeModal()

        this.serviceForm.reset({
          title: '',
          price: null,
          priceUnit: null,
          category: ServiceCategory.OTHER,
          urgency: Urgency.NORMAL,
          serviceMode: ServiceMode.IN_PERSON,
          location: Location.KOCANI,
          description: '',
          imageUrl: '',
          phone: '',
          yearsOfExperience: null,
          timePreference: null,
          duration: '',
          deadline: null
        });

      },
      error: (err) => console.error('Error while creating', err)
    });
  }

  onApplyFilterRequest(filters: { searchTerm: string; category: string; location: string }) {
    this.services$ = this.apiService.getAllServiceRequests({
      search: filters.searchTerm,
      category: filters.category,
      location: filters.location
    });
  }

}
