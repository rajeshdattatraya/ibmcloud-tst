import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionAddBulkSectorsmeComponent } from './question-add-bulk-sectorsme.component';

describe('QuestionAddBulkSectorsmeComponent', () => {
  let component: QuestionAddBulkSectorsmeComponent;
  let fixture: ComponentFixture<QuestionAddBulkSectorsmeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionAddBulkSectorsmeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionAddBulkSectorsmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
