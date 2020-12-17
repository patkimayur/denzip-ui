import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProspectiveInfoComponent } from './user-prospective-info.component';

describe('UserProspectiveInfoComponent', () => {
  let component: UserProspectiveInfoComponent;
  let fixture: ComponentFixture<UserProspectiveInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProspectiveInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProspectiveInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
