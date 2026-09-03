import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../../services/api.service';
import {
  CATEGORY_LABELS,
  IGivingService, IUser, Location,
  LOCATION_LABELS,
  PRICE_UNIT_LABELS,
  PriceUnit,
  ServiceCategory
} from "@dnevnica/shared";
import {ReviewComponent} from "../review/review.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-giving-service-detail',
  standalone: true,
  imports: [CommonModule, ReviewComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './giving-service-detail.component.html',
  styleUrls: ['./giving-service-detail.component.scss']
})
export class GivingServiceDetailsComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);
  private readonly fb = inject(FormBuilder);

  service$!: Observable<IGivingService>;
  currentUser$!: Observable<IUser>;

  isEditModalOpen = false;
  isDeleteModalOpen = false;
  currentServiceId!: number;

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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.currentServiceId = +id;
      this.service$ = this.apiService.findOne(this.currentServiceId);
    }
    this.currentUser$ = this.apiService.getCurrentUser();
  }

  openEditModal(service: IGivingService) {
    this.serviceForm.patchValue({
      title: service.title,
      price: service.price,
      priceUnit: service.priceUnit,
      category: service.category,
      yearsOfExperience: service.yearsOfExperience,
      availability: service.availability,
      phone: service.phone,
      location: service.location,
      description: service.description,
      imageUrl: service.imageUrl
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

    this.apiService.updateService(this.currentServiceId, this.serviceForm.value).subscribe({
      next: () => {
        this.service$ = this.apiService.findOne(this.currentServiceId);
        this.closeEditModal();
      },
      error: (err) => console.error('Error while updating', err)
    });
  }

  openDeleteModal() {
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }

  confirmDelete() {
    this.apiService.deleteService(this.currentServiceId).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.router.navigate(['/giving-services']);
      },
      error: (err) => console.error('Error while deleting', err)
    });
  }

}
