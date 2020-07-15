import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInterviewStatusExceptionComponent } from './view-interview-status-exception.component';

describe('ViewInterviewStatusExceptionComponent', () => {
  let component: ViewInterviewStatusExceptionComponent;
  let fixture: ComponentFixture<ViewInterviewStatusExceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewInterviewStatusExceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInterviewStatusExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
