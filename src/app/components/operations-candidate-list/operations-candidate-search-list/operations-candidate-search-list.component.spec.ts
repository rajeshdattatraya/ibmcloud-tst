import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsCandidateSearchListComponent } from './operations-candidate-search-list.component';

describe('OperationsCandidateSearchListComponent', () => {
  let component: OperationsCandidateSearchListComponent;
  let fixture: ComponentFixture<OperationsCandidateSearchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationsCandidateSearchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsCandidateSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
