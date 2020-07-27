import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenpositionsCreateComponent } from './openpositions-create.component';

describe('OpenpositionsCreateComponent', () => {
  let component: OpenpositionsCreateComponent;
  let fixture: ComponentFixture<OpenpositionsCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenpositionsCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenpositionsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
