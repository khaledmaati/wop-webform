import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitConfirmationComponent } from './submit-confirmation.component';

describe('SubmitConfirmationComponent', () => {
  let component: SubmitConfirmationComponent;
  let fixture: ComponentFixture<SubmitConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmitConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
