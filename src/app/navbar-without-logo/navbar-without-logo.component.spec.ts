import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarWithoutLogoComponent } from './navbar-without-logo.component';

describe('NavbarWithoutLogoComponent', () => {
  let component: NavbarWithoutLogoComponent;
  let fixture: ComponentFixture<NavbarWithoutLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarWithoutLogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarWithoutLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
