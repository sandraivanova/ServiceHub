import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GivingServicesComponent } from './giving-services.component';

describe('GivingServicesComponent', () => {
  let component: GivingServicesComponent;
  let fixture: ComponentFixture<GivingServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GivingServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GivingServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
