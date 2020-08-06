import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsAddSectorsmeComponent } from './questions-add-sectorsme.component';

describe('QuestionsAddSectorsmeComponent', () => {
  let component: QuestionsAddSectorsmeComponent;
  let fixture: ComponentFixture<QuestionsAddSectorsmeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsAddSectorsmeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsAddSectorsmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
