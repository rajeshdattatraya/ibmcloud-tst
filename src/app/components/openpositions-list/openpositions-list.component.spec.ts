import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenpositionsListComponent } from './openpositions-list.component';

describe('OpenpositionsListComponent', () => {
  let component: OpenpositionsListComponent;
  let fixture: ComponentFixture<OpenpositionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenpositionsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenpositionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
