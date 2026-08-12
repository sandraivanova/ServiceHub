import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ServiceCategory, Location} from "@dnevnica/shared";

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
  searchTerm: string = '';
  category: string = '';
  location: string = '';

  categories = (Object.values(ServiceCategory));
  locations = Object.values(Location);

  @Output() filterChange = new EventEmitter<{searchTerm: string, category: string, location: string}>();

  emitFilters() {
    this.filterChange.emit({
      searchTerm: this.searchTerm,
      category: this.category,
      location: this.location
    })
  }

}
