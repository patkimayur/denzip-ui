import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerOrgMappingComponent } from './broker-org-mapping.component';

describe('BrokerOrgMappingComponent', () => {
  let component: BrokerOrgMappingComponent;
  let fixture: ComponentFixture<BrokerOrgMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrokerOrgMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerOrgMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
