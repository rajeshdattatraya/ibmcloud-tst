import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminUserEditComponent } from './superadmin-user-edit.component';

describe('SuperadminUserEditComponent', () => {
  let component: SuperadminUserEditComponent;
  let fixture: ComponentFixture<SuperadminUserEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperadminUserEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperadminUserEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
