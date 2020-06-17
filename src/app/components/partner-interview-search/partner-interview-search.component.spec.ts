import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerInterviewSearchComponent } from './partner-interview-search.component';

describe('PartnerInterviewSearchComponent', () => {
  let component: PartnerInterviewSearchComponent;
  let fixture: ComponentFixture<PartnerInterviewSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerInterviewSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerInterviewSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
