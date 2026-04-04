import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NavbarComponent} from './navbar.component';
import {Router, RouterModule} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {of} from "rxjs";
import {NO_ERRORS_SCHEMA, signal} from "@angular/core";
import {LoginComponent} from "../login/login/login.component";
import {AuthUser} from "../../models/auth-user.model";

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  const authServiceMock = {
    logout: jest.fn(),
    currentUser: signal<AuthUser | null>(null),
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

  afterEach(() => {
    jest.clearAllMocks();
  })

  function getLoginLink() {
    return fixture.nativeElement.querySelector('[routerLink="/login"]');
  }

  function getLogoutButton() {
    return fixture.nativeElement.querySelector('[data-test="logout-button"]');
  }

  function beLoggedIn() {
    authServiceMock.currentUser.set({id: 1, email: 'user@example.com', memberId: null});
    fixture.detectChanges();
  }

  function beNotLoggedIn() {
    authServiceMock.currentUser.set(null);
    fixture.detectChanges();
  }

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
    beLoggedIn();
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

  describe('Template parts', () => {


    test('it should show a login button when not logged in', () => {
      beNotLoggedIn();
      const loginButton = getLoginLink();
      expect(loginButton).toBeTruthy();
    })


    test('it should show a logout button when logged in', () => {
      beLoggedIn();
      const logoutButton = getLogoutButton();
      expect(logoutButton).toBeTruthy();
    })


    test('It should not show a login button when logged in', () => {
      beLoggedIn();
      const loginButton = getLoginLink();

      expect(loginButton).toBeFalsy();

    })


    test('It should not show a logout button when not logged in', () => {
      beNotLoggedIn();
      expect(getLogoutButton()).toBeFalsy();
    });

  })
});
