import {getTestBed, TestBed} from '@angular/core/testing';
import {HttpClient, HttpClientModule} from "@angular/common/http";

import {BackendService, Grape} from './backend.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

// Based on https://stackoverflow.com/questions/59204306/trying-to-run-angular-httpclient-jasmine-test-against-live-rest-api-nothing-hap
describe('BackendService with mocked backend (faking MariaDB)', () => {

  // Läs mera https://stackoverflow.com/questions/46930581/how-to-mock-httpclient-in-a-provided-service-in-a-component-test-in-angular
  // https://medium.com/netscape/testing-with-the-angular-httpclient-api-648203820712
  // https://angular.io/guide/http#testing-http-requests
  // https://www.thecodebuzz.com/angular-unit-test-and-mock-httpclient-get-request/
  // https://ng-mocks.sudo.eu/guides/http-request

  let service: BackendService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [BackendService,],
    });

    service = TestBed.inject(BackendService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    // TODO: Read about mocking HttpClient
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should contain Riesling', (done) => {

    const riesling: Grape = {"name": "Riesling", "color": "grön"};
    const grapes: Grape[] = [riesling];

    service
      .getGrapes()
      .subscribe({
          next: result => {
            expect(result).toContain({name: 'Riesling', color: 'grön'});
            done();
          },
          error: done.fail
        }
      );

    const req = httpMock.expectOne('http://helges-mbp-2:3000/grapes');
    req.flush(grapes);

  });

});



xdescribe('BackendService Test with active backend (MariaDB)', () => {
  let httpClient: HttpClient;
  let service: BackendService;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    httpClient = TestBed.inject(HttpClient); // Stackoverflow: .get instead of .inject.
    service = TestBed.inject(BackendService); // Stackoverflow: .get instead of .inject.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should contain Riesling', (done) => {
    service
      .getGrapes()
      .subscribe((result) => {

        expect(result).toContain({name: 'Riesling', color: 'grön'});
        done();
      });
  });


  it('should return a list of expected length', (done) => {
    service
      .getGrapes()
      .subscribe((result) => {
        expect(result.length ).toBe(4);
        done();
      });
  });


  // TODO: Testa att backend anropas när vi anropar BackendService, men mocka själva backend,
  //  så att inte databasen manipuleras.
  it('should add a grape', (done) => {
    const g: Grape = {name: "Ris2", color: "grön"}
    service
      .addGrape(g)
      .subscribe((result) => {
        //expect(result.length ).toBe(3);
        done();
      });
  });

});

describe('A test that can be made to fail or pass', () => {
  it('should fail', () => {
    expect(1 + 1).toBe(2);
  });
});
