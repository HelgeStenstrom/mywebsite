import {TestBed} from '@angular/core/testing';
import {HttpClient, HttpClientModule} from "@angular/common/http";

import {BackendService, Grape} from './backend.service';
import {HttpTestingController} from "@angular/common/http/testing";

// Based on https://stackoverflow.com/questions/59204306/trying-to-run-angular-httpclient-jasmine-test-against-live-rest-api-nothing-hap
describe('BackendService with mocked backend (faking MariaDB)', () => {

  let service: BackendService;

  // Läs mera https://stackoverflow.com/questions/46930581/how-to-mock-httpclient-in-a-provided-service-in-a-component-test-in-angular
  // https://medium.com/netscape/testing-with-the-angular-httpclient-api-648203820712
  // https://angular.io/guide/http#testing-http-requests
  // https://www.thecodebuzz.com/angular-unit-test-and-mock-httpclient-get-request/
  // https://ng-mocks.sudo.eu/guides/http-request

  const httpClientStub: Partial<HttpClient> = {
/*
    get(url: string): Observable<Grape[]> {
      const aGrape: Grape = {name: 'Riesling?', color:'grön'};
      const someGrapes: Grape[] = [aGrape];
      const observable: Observable<Grape[]> = of(someGrapes);
      return observable;
    }
*/
  };

  const httpMock: HttpTestingController = TestBed.get(
    HttpTestingController,
  );

  beforeEach(() => {
    TestBed.configureTestingModule({

      providers: [{provide: HttpClient, useValue: httpClientStub}],
    });
    // TODO: Read about mocking HttpClient
    service = TestBed.inject(BackendService);
  });

  it('should contain Riesling', (done) => {
    service
      .getGrapes()
      .subscribe((result) => {

        expect(result).toContain({name: 'Riesling', color: 'grön'});
        done();
      });
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
