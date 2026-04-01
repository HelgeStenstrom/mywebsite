import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NavbarComponent} from './navbar.component';
import {Router, RouterModule} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {of} from "rxjs";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {LoginComponent} from "../login/login/login.component";

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  const authServiceMock = {
    logout: jest.fn(),
  };


  beforeEach(async () => {
    authServiceMock.logout.mockClear();

    await TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterModule.forRoot([{path: 'login', component: LoginComponent}])],
      providers: [
        {provide: AuthService, useValue: authServiceMock},
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should show logo', () => {
    expect(fixture.nativeElement.querySelector('[data-test="logo"]')).toBeTruthy();
  });

  test('should show menu', () => {
    expect(fixture.nativeElement.querySelector('[data-test="menu"]')).toBeTruthy();
  });

  test('logout calls AuthService.logout and navigates to /login', () => {
    authServiceMock.logout.mockReturnValue(of(null));
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate');

    const logoutButton = fixture.nativeElement.querySelector('[data-test="logout-button"]');
    expect(logoutButton).toBeTruthy();
    logoutButton.click();
    fixture.detectChanges();


    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
