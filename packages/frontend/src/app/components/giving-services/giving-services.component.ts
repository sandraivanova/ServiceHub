import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {IGivingService, PriceUnit, ServiceCategory} from "@dnevnica/shared";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-giving-services',
  standalone: true,
  imports: [
    FormsModule, CommonModule, RouterLink
  ],
  templateUrl: './giving-services.component.html',
  styleUrl: './giving-services.component.scss'
})
export class GivingServicesComponent implements OnInit {
  services: IGivingService[] = [];
  isModalOpen = false;

  priceUnits = Object.values(PriceUnit);
  categories = Object.values(ServiceCategory);

  newService: IGivingService = {
    providerId: 1,
    title: '',
    priceFrom: 0,
    priceUnit: PriceUnit.HOUR,
    category: ServiceCategory.OTHER,
    location: '',
    description: '',
    yearsOfExperience: 1,
    rating: 1,
    bookingCount: 1,
    imageUrl: '',
    phone: '',
    availability: ''
  };

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices() {
    this.apiService.getAll().subscribe({
      next: (data) => this.services = data,
      error: (err) => console.error('Error while loading', err)
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  createService() {
    this.apiService.create(this.newService).subscribe({
      next: (res) => {
        console.log('Успешно креирано:', res);
        this.loadServices();
        this.closeModal()
      },
      error: (err) => console.error('Error while creating', err)
    });
  }


}
