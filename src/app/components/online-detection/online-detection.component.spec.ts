import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineDetectionComponent } from './online-detection.component';

describe('OnlineDetectionComponent', () => {
  let component: OnlineDetectionComponent;
  let fixture: ComponentFixture<OnlineDetectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineDetectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
