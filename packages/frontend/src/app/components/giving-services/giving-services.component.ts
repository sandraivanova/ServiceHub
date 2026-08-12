import {Component, inject, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {IGivingService, Location, PriceUnit, ServiceCategory} from "@dnevnica/shared";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {Observable} from "rxjs";
import { ServiceFilterComponent } from '../service-filter/service-filter.component';

@Component({
  selector: 'app-giving-services',
  standalone: true,
  imports: [
    FormsModule, CommonModule, RouterLink, ServiceFilterComponent
  ],
  templateUrl: './giving-services.component.html',
  styleUrl: './giving-services.component.scss'
})
export class GivingServicesComponent {
  isModalOpen = false;

  priceUnits = Object.values(PriceUnit);
  categories = Object.values(ServiceCategory);
  locations = Object.values(Location);

  newService: IGivingService = {
    providerId: 1,
    title: '',
    price: 0,
    priceUnit: PriceUnit.HOUR,
    category: ServiceCategory.OTHER,
    location: Location.KOCANI,
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

  onApplyFilter(filters: { searchTerm: string; category: string; location: string }) {
    this.services$ = this.apiService.getAll({
      search: filters.searchTerm,
      category: filters.category,
      location: filters.location
    });
  }


}
