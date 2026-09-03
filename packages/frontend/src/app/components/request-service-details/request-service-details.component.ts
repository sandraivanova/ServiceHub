import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';
import {
  CATEGORY_LABELS,
  IUser,
  Location,
  LOCATION_LABELS,
  PRICE_UNIT_LABELS,
  PriceUnit,
  ServiceCategory,
  URGENCY_LABELS,
  Urgency
} from "@dnevnica/shared";
import {
  IRequestService,
  SERVICE_MODE_LABELS,
  ServiceMode,
  TIME_PREFERENCE_LABELS,
  TimePreference
} from "@dnevnica/shared/models/request_service";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
  selector: 'app-request-service-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './request-service-details.component.html',
  styleUrls: ['./request-service-details.component.scss']
})
export class RequestServiceDetailsComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  service$!: Observable<IRequestService>;
  currentUser$!: Observable<IUser>;

  isEditModalOpen = false;
  isDeleteModalOpen = false;
  currentServiceId!: number;

  priceUnitLabels = PRICE_UNIT_LABELS;
  categoryLabels = CATEGORY_LABELS;
  locationLabels = LOCATION_LABELS;
  urgencyLabels = URGENCY_LABELS;
  serviceModeLabels = SERVICE_MODE_LABELS;
  timePreferenceLabels = TIME_PREFERENCE_LABELS;

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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.currentServiceId = +id;
      this.service$ = this.apiService.findOneServiceRequest(this.currentServiceId);
    }
    this.currentUser$ = this.apiService.getCurrentUser();
  }

  openEditModal(service: IRequestService) {
    this.serviceForm.patchValue({
      title: service.title,
      price: service.price,
      priceUnit: service.priceUnit,
      category: service.category,
      urgency: service.urgency,
      serviceMode: service.serviceMode,
      location: service.location,
      description: service.description,
      yearsOfExperience: service.yearsOfExperience,
      imageUrl: service.imageUrl,
      phone: service.phone,
      timePreference: service.timePreference,
      duration: service.duration,
      deadline: service.deadline ? new Date(service.deadline).toISOString().split('T')[0] : null
    });
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  updateService() {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    this.apiService.updateServiceRequest(this.currentServiceId, this.serviceForm.value).subscribe({
      next: () => {
        this.service$ = this.apiService.findOneServiceRequest(this.currentServiceId);
        this.closeEditModal();
      },
      error: (err) => console.error('Error while updating request service', err)
    });
  }

  openDeleteModal() {
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }

  confirmDelete() {
    this.apiService.deleteServiceRequest(this.currentServiceId).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.router.navigate(['/request-services']);
      },
      error: (err) => console.error('Error while deleting request service', err)
    });
  }
}
