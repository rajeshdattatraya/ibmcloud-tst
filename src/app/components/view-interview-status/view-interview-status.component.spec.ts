import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInterviewStatusComponent } from './view-interview-status.component';

describe('ViewInterviewStatusComponent', () => {
  let component: ViewInterviewStatusComponent;
  let fixture: ComponentFixture<ViewInterviewStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewInterviewStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInterviewStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
