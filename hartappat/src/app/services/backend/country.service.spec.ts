import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CountryService} from './country.service';
import {CountryApi} from '../../models/common.model';

describe('CountryService', () => {

  let service: CountryService;
  let httpTestingController: HttpTestingController;
  let url: string;

  const aCountry: CountryApi = {id: 1, name: 'Sverige', isUsed: false};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CountryService],
    });
    service = TestBed.inject(CountryService);
    httpTestingController = TestBed.inject(HttpTestingController);
    url = service.apiBase + '/countries';
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  test('it gets countries', done => {
    service.getCountries().subscribe(result => {
      expect(result).toEqual([aCountry]);
      done();
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush([aCountry]);
  });

  test('it adds a country', done => {
    service.addCountry('Sverige').subscribe(result => {
      expect(result).toEqual(aCountry);
      done();
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({name: 'Sverige'});
    req.flush(aCountry);
  });

  test('it deletes a country', done => {
    service.deleteCountry(1).subscribe(() => {
      done();
    });

    const req = httpTestingController.expectOne(`${url}/1`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
  });

});
