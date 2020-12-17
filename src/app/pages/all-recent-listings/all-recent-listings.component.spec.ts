import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRecentListingsComponent } from './all-recent-listings.component';

describe('AllRecentListingsComponent', () => {
  let component: AllRecentListingsComponent;
  let fixture: ComponentFixture<AllRecentListingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllRecentListingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllRecentListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
