import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ServiceCategory, Location, CATEGORY_LABELS, LOCATION_LABELS} from "@dnevnica/shared";

@Component({
  selector: 'app-service-filter',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './service-filter.component.html',
  styleUrl: './service-filter.component.scss'
})
export class ServiceFilterComponent {
  searchTerm = '';
  category = '';
  location = '';

  categoryLabels=CATEGORY_LABELS;
  locationLabels= LOCATION_LABELS;

  categories = (Object.values(ServiceCategory));
  locations = Object.values(Location);

  @Output() filterChangeEmmiter = new EventEmitter<{ searchTerm: string, category: string, location: string }>();

  emitFilters() {
    this.filterChangeEmmiter.emit({
      searchTerm: this.searchTerm,
      category: this.category,
      location: this.location
    })
  }

}
