import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerOrgRegComponent } from './broker-org-reg.component';

describe('BrokerOrgRegComponent', () => {
  let component: BrokerOrgRegComponent;
  let fixture: ComponentFixture<BrokerOrgRegComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerOrgRegComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerOrgRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
