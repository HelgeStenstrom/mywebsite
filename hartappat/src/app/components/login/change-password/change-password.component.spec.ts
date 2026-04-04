import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChangePasswordComponent} from './change-password.component';
import {AuthService} from "../../../services/auth.service";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {of, throwError} from "rxjs";

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;

  const authServiceMock = {
    changePassword: jest.fn(),
  };


  beforeEach(async () => {
    authServiceMock.changePassword.mockClear();

    await TestBed.configureTestingModule({
      imports: [ChangePasswordComponent],
      providers: [
        {provide: AuthService, useValue: authServiceMock},
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Parts of the page', () => {

    test('it should have an input for the current password', () => {
      const input = fixture.nativeElement.querySelector('input[name="currentPassword"]');
      expect(input).toBeTruthy();
    });

    test('it should have an input for the new password', () => {
      const input = fixture.nativeElement.querySelector('input[name="newPassword"]');
      expect(input).toBeTruthy();
    });

    test('it should have another input to confirm the new password', () => {
      const input = fixture.nativeElement.querySelector('input[name="confirmNewPassword"]');
      expect(input).toBeTruthy();
    });

    test('it should have a submit button', () => {
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button).toBeTruthy();
    });

  });

  describe('Form actions', () => {

    test("When new passwords are empty, the submit-button is disabled", () => {
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      const input = fixture.nativeElement.querySelector('input[name="newPassword"]');
      const confirmInput = fixture.nativeElement.querySelector('input[name="confirmNewPassword"]');
      input.value = '';
      confirmInput.value = '';
      fixture.detectChanges();

      expect(button.disabled).toBeTruthy();
    })

    test('on submit, it calls changePassword', () => {
      authServiceMock.changePassword.mockReturnValue(of({}));
      const spy = jest.spyOn(component, 'changePassword');

      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      const input = fixture.nativeElement.querySelector('input[name="newPassword"]');
      const confirmInput = fixture.nativeElement.querySelector('input[name="confirmNewPassword"]');

      input.value = 'validPassword';
      input.dispatchEvent(new Event('input'));
      confirmInput.value = 'validPassword';
      confirmInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      button.click();
      expect(button.disabled).toBeFalsy();
      expect(spy).toHaveBeenCalled();

    });


    test('on submit, it should call AuthService.changePassword with the right values', () => {
      authServiceMock.changePassword.mockReturnValue(of({}));

      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      const currentPassword = fixture.nativeElement.querySelector('input[name="currentPassword"]');
      const newPassword = fixture.nativeElement.querySelector('input[name="newPassword"]');
      const confirmNewPassword = fixture.nativeElement.querySelector('input[name="confirmNewPassword"]');

      currentPassword.value = 'old password';
      currentPassword.dispatchEvent(new Event('input'));
      newPassword.value = 'validPassword';
      newPassword.dispatchEvent(new Event('input'));
      confirmNewPassword.value = 'validPassword';
      confirmNewPassword.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      button.click();
      expect(authServiceMock.changePassword).toHaveBeenCalledWith('old password', 'validPassword');

      const warnings = fixture.nativeElement.querySelectorAll('[class="warning"]');
      expect(warnings.length).toBe(0);

    });

    test('The submit button is disabled if the password is too short', () => {
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      const input = fixture.nativeElement.querySelector('input[name="newPassword"]');
      const confirmInput = fixture.nativeElement.querySelector('input[name="confirmNewPassword"]');

      input.value = 'x';
      confirmInput.value = 'x';

      input.dispatchEvent(new Event('input'));
      confirmInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      expect(button.disabled).toBeTruthy();
    });

    test('The submit button is enabled if the password is long enough', () => {
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      const input = fixture.nativeElement.querySelector('input[name="newPassword"]');
      const confirmInput = fixture.nativeElement.querySelector('input[name="confirmNewPassword"]');
      input.value = 'long password';
      confirmInput.value = 'long password';
      input.dispatchEvent(new Event('input'));
      confirmInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      expect(button.disabled).toBeFalsy();
    });

    test("The submit button is disabled if the new passwords don't match", () => {
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      const input = fixture.nativeElement.querySelector('input[name="newPassword"]');
      const confirmInput = fixture.nativeElement.querySelector('input[name="confirmNewPassword"]');

      input.value = 'a valid long password';
      confirmInput.value = 'wrong long password';

      input.dispatchEvent(new Event('input'));
      confirmInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      expect(button.disabled).toBeTruthy();
    });

    test("When new passwords don't match, a warning message is displayed", () => {
        const button = fixture.nativeElement.querySelector('button[type="submit"]');
        const input = fixture.nativeElement.querySelector('input[name="newPassword"]');
        const confirmInput = fixture.nativeElement.querySelector('input[name="confirmNewPassword"]');

        input.value = 'a valid long password';
        confirmInput.value = 'wrong long password';

        input.dispatchEvent(new Event('input'));
        confirmInput.dispatchEvent(new Event('input'));

        fixture.detectChanges();

      }
    );

    test('A confirmation message is shown on success. Error message is not shown.', () => {
      authServiceMock.changePassword.mockReturnValue(of({}));

      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      const input = fixture.nativeElement.querySelector('input[name="newPassword"]');
      const confirmInput = fixture.nativeElement.querySelector('input[name="confirmNewPassword"]');

      input.value = 'a valid password';
      confirmInput.value = 'a valid password';

      input.dispatchEvent(new Event('input'));
      confirmInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      button.click();
      fixture.detectChanges();

      const warnings = fixture.nativeElement.querySelectorAll('[class="warning"]');
      expect(warnings.length).toBe(0);

      const successMessage = fixture.nativeElement.querySelector('[data-test="success-message"]');
      expect(successMessage).toBeTruthy();
    });


    test('On 403, a message is shown about wrong current password', () => {
      authServiceMock.changePassword.mockReturnValue(throwError(() => ({status: 403})));

      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      const input = fixture.nativeElement.querySelector('input[name="newPassword"]');
      const confirmInput = fixture.nativeElement.querySelector('input[name="confirmNewPassword"]');
      input.value = 'a valid password';
      confirmInput.value = 'a valid password';

      input.dispatchEvent(new Event('input'));
      confirmInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      button.click();
      fixture.detectChanges();

      expect(authServiceMock.changePassword).toHaveBeenCalled();

      const wrongPasswordMessage = fixture.nativeElement.querySelector('[data-test="wrong-password-message"]');
      expect(wrongPasswordMessage).toBeTruthy();

    });

    test('On 401, a message is shown about not being authenticated', () => {
      authServiceMock.changePassword.mockReturnValue(throwError(() => ({status: 401})));

      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      const input = fixture.nativeElement.querySelector('input[name="newPassword"]');
      const confirmInput = fixture.nativeElement.querySelector('input[name="confirmNewPassword"]');
      input.value = 'a valid password';
      confirmInput.value = 'a valid password';

      input.dispatchEvent(new Event('input'));
      confirmInput.dispatchEvent(new Event('input'));

      fixture.detectChanges();
      button.click();
      fixture.detectChanges();

      expect(authServiceMock.changePassword).toHaveBeenCalled();

      const wrongPasswordMessage = fixture.nativeElement.querySelector('[data-test="warning-401-message"]');
      expect(wrongPasswordMessage).toBeTruthy();

    });

    test.todo('On 400, a message is shown about invalid new password');

  })
});
