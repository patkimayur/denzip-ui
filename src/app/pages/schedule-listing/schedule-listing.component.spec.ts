import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleListingComponent } from './schedule-listing.component';

describe('ScheduleListingComponent', () => {
  let component: ScheduleListingComponent;
  let fixture: ComponentFixture<ScheduleListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
