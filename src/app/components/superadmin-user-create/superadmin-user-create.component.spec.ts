import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminUserCreateComponent } from './superadmin-user-create.component';

describe('SuperadminUserCreateComponent', () => {
  let component: SuperadminUserCreateComponent;
  let fixture: ComponentFixture<SuperadminUserCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperadminUserCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperadminUserCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
