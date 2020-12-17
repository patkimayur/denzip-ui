import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortlistedListingComponent } from './shortlisted-listing.component';

describe('ShortlistedListingComponent', () => {
  let component: ShortlistedListingComponent;
  let fixture: ComponentFixture<ShortlistedListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortlistedListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortlistedListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
