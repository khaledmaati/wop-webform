import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSentNotificationComponent } from './form-sent-notification.component';

describe('FormSentNotificationComponent', () => {
  let component: FormSentNotificationComponent;
  let fixture: ComponentFixture<FormSentNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSentNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormSentNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
