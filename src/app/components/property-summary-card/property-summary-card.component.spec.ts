import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertySummaryCardComponent } from './property-summary-card.component';

describe('PropertySummaryCardComponent', () => {
  let component: PropertySummaryCardComponent;
  let fixture: ComponentFixture<PropertySummaryCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertySummaryCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertySummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
