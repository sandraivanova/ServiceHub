import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GivingServiceDetailComponent } from './giving-service-detail.component';

describe('GivingServiceDetailComponent', () => {
  let component: GivingServiceDetailComponent;
  let fixture: ComponentFixture<GivingServiceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GivingServiceDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GivingServiceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
