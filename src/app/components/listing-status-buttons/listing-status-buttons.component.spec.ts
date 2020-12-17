import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingStatusButtonsComponent } from './listing-status-buttons.component';

describe('ListingStatusButtonsComponent', () => {
  let component: ListingStatusButtonsComponent;
  let fixture: ComponentFixture<ListingStatusButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListingStatusButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingStatusButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
