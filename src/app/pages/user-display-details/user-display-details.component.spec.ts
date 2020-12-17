import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDisplayDetailsComponent } from './user-display-details.component';

describe('UserDisplayDetailsComponent', () => {
  let component: UserDisplayDetailsComponent;
  let fixture: ComponentFixture<UserDisplayDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDisplayDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDisplayDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
