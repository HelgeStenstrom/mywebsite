import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LoginComponent} from './login.component';
import {AuthService} from "../../../services/auth.service";
import {Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const authServiceMock = {
    login: jest.fn(),
  };

  const routerMock = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    authServiceMock.login.mockClear();
    routerMock.navigate.mockClear();

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        {provide: AuthService, useValue: authServiceMock},
        {provide: Router, useValue: routerMock},
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Template parts', () => {
    test('it should have an input field for the email address', () => {
      const inputElement = fixture.nativeElement.querySelector('[data-test="email-input"]');
      expect(inputElement).toBeTruthy();
    })

    test('it should have an input field for the secret password', () => {
      const inputElement = fixture.nativeElement.querySelector('[data-test="password-input"]');
      expect(inputElement).toBeTruthy();
    })

    test('it should have a login button', () => {
      const buttonElement = fixture.nativeElement.querySelector('[data-test="submit"]');
      expect(buttonElement).toBeTruthy();
    })

  })

  describe('Form use', () => {

    test('Clicking the login button calls login', () => {
      authServiceMock.login.mockReturnValue(of({}));
      const spy = jest.spyOn(component, 'login');
      const submitButton = fixture.nativeElement.querySelector('[data-test="submit"]');
      submitButton.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    })

    test('email and password are passed to AuthService', () => {
      authServiceMock.login.mockReturnValue(of({}));

      const emailInput = fixture.nativeElement.querySelector('[data-test="email-input"]');
      const passwordInput = fixture.nativeElement.querySelector('[data-test="password-input"]');
      const submitButton = fixture.nativeElement.querySelector('[data-test="submit"]');
      emailInput.value = 'user@example.com';
      passwordInput.value = 'secret';
      emailInput.dispatchEvent(new Event('input'));
      passwordInput.dispatchEvent(new Event('input'));
      submitButton.click();
      fixture.detectChanges();
      expect(authServiceMock.login).toHaveBeenCalledWith('user@example.com', 'secret');

      const warningMessage = fixture.nativeElement.querySelector('[data-test="warning"]');
      expect(warningMessage).toBeFalsy();
    })

    test('login navigates to / on success', () => {
      authServiceMock.login.mockReturnValue(of({}));
      const emailInput = fixture.nativeElement.querySelector('[data-test="email-input"]');
      const passwordInput = fixture.nativeElement.querySelector('[data-test="password-input"]')
      const submitButton = fixture.nativeElement.querySelector('[data-test="submit"]');
      emailInput.value = 'user@example.com';
      passwordInput.value = 'secret';
      emailInput.dispatchEvent(new Event('input'));
      passwordInput.dispatchEvent(new Event('input'));
      submitButton.click();
      fixture.detectChanges();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    })

    test('login shows warning message on failure', () => {

      authServiceMock.login.mockReturnValue(throwError(() => new Error('Unauthorized')));
      const emailInput = fixture.nativeElement.querySelector('[data-test="email-input"]');
      const passwordInput = fixture.nativeElement.querySelector('[data-test="password-input"]')
      const submitButton = fixture.nativeElement.querySelector('[data-test="submit"]');
      emailInput.value = 'user@example.com';
      passwordInput.value = 'wrongPassword';
      emailInput.dispatchEvent(new Event('input'));
      passwordInput.dispatchEvent(new Event('input'));
      submitButton.click();
      fixture.detectChanges();

      const warningMessage = fixture.nativeElement.querySelector('[data-test="warning"]');
      expect(warningMessage).toBeTruthy();
    })

  })

});
