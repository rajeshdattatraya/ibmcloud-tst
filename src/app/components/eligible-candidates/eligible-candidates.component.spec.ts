import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibleCandidatesComponent } from './eligible-candidates.component';

describe('EligibleCandidatesComponent', () => {
  let component: EligibleCandidatesComponent;
  let fixture: ComponentFixture<EligibleCandidatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EligibleCandidatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EligibleCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
