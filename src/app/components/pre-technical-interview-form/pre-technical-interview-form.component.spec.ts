import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreTechnicalInterviewFormComponent } from './pre-technical-interview-form.component';

describe('TechnicalInterviewListComponent', () => {
  let component: PreTechnicalInterviewFormComponent;
  let fixture: ComponentFixture<PreTechnicalInterviewFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreTechnicalInterviewFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreTechnicalInterviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
