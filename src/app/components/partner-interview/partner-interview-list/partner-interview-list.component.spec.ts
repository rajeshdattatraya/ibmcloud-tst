import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerInterviewListComponent } from './partner-interview-list.component';

describe('PartnerInterviewListComponent', () => {
  let component: PartnerInterviewListComponent;
  let fixture: ComponentFixture<PartnerInterviewListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerInterviewListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerInterviewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
