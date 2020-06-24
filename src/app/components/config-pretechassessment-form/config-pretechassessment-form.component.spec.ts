import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigPretechassessmentFormComponent } from './config-pretechassessment-form.component';

describe('ConfigPretechassessmentFormComponent', () => {
  let component: ConfigPretechassessmentFormComponent;
  let fixture: ComponentFixture<ConfigPretechassessmentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigPretechassessmentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigPretechassessmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
