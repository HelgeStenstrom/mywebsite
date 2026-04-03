import {AuthService} from "./auth.service";
import {HttpTestingController, provideHttpClientTesting} from "@angular/common/http/testing";
import {TestBed} from "@angular/core/testing";
import {provideHttpClient} from "@angular/common/http";

describe('AuthService', () => {

  let service: AuthService;
  let httpTestingController: HttpTestingController;
  let url: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
    url = service.apiBase + '/auth';
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  test('login posts email and password', done => {
    service.login('user@example.com', 'secret').subscribe(() => {
      done();
    });

    const req = httpTestingController.expectOne(`${url}/login`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({email: 'user@example.com', password: 'secret'});
    req.flush({id: 1, email: 'user@example.com', memberId: null});
  });

  test('logout posts to logout endpoint', done => {
    service.logout().subscribe(() => {
      done();
    });

    const req = httpTestingController.expectOne(`${url}/logout`);
    expect(req.request.method).toEqual('POST');
    req.flush(null);
  });

  test('me gets current user', done => {
    service.me().subscribe(result => {
      expect(result).toEqual({id: 1, email: 'user@example.com', memberId: null});
      done();
    });

    const req = httpTestingController.expectOne(`${url}/me`);
    expect(req.request.method).toEqual('GET');
    req.flush({id: 1, email: 'user@example.com', memberId: null});
  });

  test('changePassword posts currentPassword and newPassword', done => {
    service.changePassword('oldPass', 'newPass').subscribe(() => {
      done();
    });

    const req = httpTestingController.expectOne(`${url}/change-password`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({currentPassword: 'oldPass', newPassword: 'newPass'});
    req.flush(null);
  });

  describe('Current user', () => {

    test('currentUser is null initially', () => {
      expect(service.currentUser()).toBeNull();
    });

    test('currentUser is set after successful login', done => {
      const authUser = { id: 1, email: 'user@example.com', memberId: null };
      service.login('user@example.com', 'secret').subscribe(() => {
        expect(service.currentUser()).toEqual(authUser);
        done();
      });

      const req = httpTestingController.expectOne(`${url}/login`);
      req.flush(authUser);
    });

    test('currentUser is null after logout', done => {
      service.currentUser.set({ id: 1, email: 'user@example.com', memberId: null });

      service.logout().subscribe(() => {
        expect(service.currentUser()).toBeNull();
        done();
      });

      const req = httpTestingController.expectOne(`${url}/logout`);
      req.flush(null);
    });

    test('fetchCurrentUser sets currentUser', done => {
      const authUser = { id: 1, email: 'user@example.com', memberId: null };

      service.fetchCurrentUser().subscribe(() => {
        expect(service.currentUser()).toEqual(authUser);
        done();
      });

      const req = httpTestingController.expectOne(`${url}/me`);
      req.flush(authUser);
    });

  })

});
