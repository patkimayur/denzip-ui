import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleRequestComponent } from './schedule-request.component';

describe('ScheduleRequestComponent', () => {
  let component: ScheduleRequestComponent;
  let fixture: ComponentFixture<ScheduleRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
