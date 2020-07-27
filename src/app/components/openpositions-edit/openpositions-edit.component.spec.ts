import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenpositionsEditComponent } from './openpositions-edit.component';

describe('OpenpositionsEditComponent', () => {
  let component: OpenpositionsEditComponent;
  let fixture: ComponentFixture<OpenpositionsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenpositionsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenpositionsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
