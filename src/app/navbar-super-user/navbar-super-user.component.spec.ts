import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarSuperUserComponent } from './navbar-super-user.component';

describe('NavbarSuperUserComponent', () => {
  let component: NavbarSuperUserComponent;
  let fixture: ComponentFixture<NavbarSuperUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarSuperUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarSuperUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
