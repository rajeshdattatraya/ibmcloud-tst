import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsCandidateSearchComponent } from './operations-candidate-search.component';

describe('OperationsCandidateSearchComponent', () => {
  let component: OperationsCandidateSearchComponent;
  let fixture: ComponentFixture<OperationsCandidateSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationsCandidateSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsCandidateSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
