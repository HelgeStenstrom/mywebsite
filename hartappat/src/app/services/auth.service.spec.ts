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

});
