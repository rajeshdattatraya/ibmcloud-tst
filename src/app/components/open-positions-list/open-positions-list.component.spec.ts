import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenPositionsListComponent } from './open-positions-list.component';

describe('OpenPositionsListComponent', () => {
  let component: OpenPositionsListComponent;
  let fixture: ComponentFixture<OpenPositionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenPositionsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenPositionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
