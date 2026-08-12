import {Component, inject, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {IGivingService, PriceUnit, ServiceCategory} from "@dnevnica/shared";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {Observable} from "rxjs";

@Component({
  selector: 'app-giving-services',
  standalone: true,
  imports: [
    FormsModule, CommonModule, RouterLink
  ],
  templateUrl: './giving-services.component.html',
  styleUrl: './giving-services.component.scss'
})
export class GivingServicesComponent {
  isModalOpen = false;

  priceUnits = Object.values(PriceUnit);
  categories = Object.values(ServiceCategory);

  newService: IGivingService = {
    providerId: 1,
    title: '',
    price: 0,
    priceUnit: PriceUnit.HOUR,
    category: ServiceCategory.OTHER,
    location: '',
    description: '',
    yearsOfExperience: 1,
    imageUrl: '',
    phone: '',
    availability: ''
  };

  private readonly apiService=inject(ApiService)
  services$: Observable<IGivingService[]> = this.apiService.getAll();


  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  createService() {
    this.apiService.create(this.newService).subscribe({
      next: (res) => {
        this.services$ = this.apiService.getAll();
        this.closeModal()
      },
      error: (err) => console.error('Error while creating', err)
    });
  }


}
