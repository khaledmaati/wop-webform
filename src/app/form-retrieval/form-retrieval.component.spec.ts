import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRetrievalComponent } from './form-retrieval.component';

describe('FormRetrievalComponent', () => {
  let component: FormRetrievalComponent;
  let fixture: ComponentFixture<FormRetrievalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormRetrievalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormRetrievalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
