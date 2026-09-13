import {Component} from '@angular/core';
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {HowItWorksComponent} from "../how-it-works/how-it-works.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink, HowItWorksComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  categories = [
    {name: 'Домашни услуги', icon: '🏠'},
    {name: 'Чистење', icon: '🧹'},
    {name: 'Водовод', icon: '🔧'},
    {name: 'Електричарски услуги', icon: '⚡'},
    {name: 'Паркинг', icon: '🅿️'},
    {name: 'Автомобилски услуги', icon: '🚗'},
    {name: 'ИТ и технологија', icon: '💻'},
    {name: 'Повеќе', icon: '➕'},
  ]
}
