import { TestBed } from '@angular/core/testing';
import {HttpClient, HttpClientModule} from "@angular/common/http";

import {BackendService, Grape} from './backend.service';

// Based on https://stackoverflow.com/questions/59204306/trying-to-run-angular-httpclient-jasmine-test-against-live-rest-api-nothing-hap
describe('BackendService Test with active backend (MariaDB)', () => {
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
