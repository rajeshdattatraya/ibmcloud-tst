import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminuserCreateComponent } from './adminuser-create.component';

describe('AdminuserCreateComponent', () => {
  let component: AdminuserCreateComponent;
  let fixture: ComponentFixture<AdminuserCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminuserCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminuserCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
