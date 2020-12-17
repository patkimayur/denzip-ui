import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorSearchListingComponent } from './error-search-listing.component';

describe('ErrorSearchListingComponent', () => {
  let component: ErrorSearchListingComponent;
  let fixture: ComponentFixture<ErrorSearchListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorSearchListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorSearchListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
