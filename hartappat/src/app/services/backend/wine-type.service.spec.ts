import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {WineTypeService} from './wine-type.service';
import {WineTypeApi} from '../../models/common.model';
import {provideHttpClient} from "@angular/common/http";

describe('WineTypeService', () => {

  let service: WineTypeService;
  let httpTestingController: HttpTestingController;
  let url: string;

  const aWineType: WineTypeApi = {id: 1, name: 'Rött', isUsed: false};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WineTypeService,provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(WineTypeService);
    httpTestingController = TestBed.inject(HttpTestingController);
    url = service.apiBase + '/wine-types';
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  test('It gets wine types', done => {
    service
      .getWineTypes()
      .subscribe(result => {
        expect(result).toEqual([aWineType]);
        done();
      });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush([aWineType]);
  })

  test('It adds a wine type', done => {
    service.addWineType('rött').subscribe(result => {
      expect(result).toEqual(aWineType);
      done();
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({name: 'rött'})
    req.flush(aWineType);
  })

  test('It deletes a wine-type', done => {
    service.deleteWineType(1).subscribe(() => {
      done();
    });

    const req = httpTestingController.expectOne(`${url}/1`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);

  })

});
