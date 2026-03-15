import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TastingService} from './tasting.service';
import {WineTastingApi, WineTastingCreate, WineTastingWine, WineTastingWineCreate} from '../../models/tasting.model';

describe('TastingService', () => {

  let service: TastingService;
  let httpTestingController: HttpTestingController;
  let url: string;

  const aTastingApi: WineTastingApi = {
    id: 1,
    title: 'Testprovning',
    notes: 'Några noter',
    tastingDate: '2024-01-15',
  };

  const aTastingCreate: WineTastingCreate = {
    title: 'Testprovning',
    notes: 'Några noter',
    tastingDate: '2024-01-15',
  };

  const aTasting = {
    id: 1,
    title: 'Testprovning',
    notes: 'Några noter',
    tastingDate: '2024-01-15',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TastingService],
    });
    service = TestBed.inject(TastingService);
    httpTestingController = TestBed.inject(HttpTestingController);
    url = service.apiBase + '/tastings';
  });

  afterEach(() => {
    httpTestingController.verify();
  });


  test('It gets tastings', done => {
    service.getTastings()
      .subscribe(result => {
        expect(result).toEqual([aTasting]);
        done();
      });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush([aTastingApi]);
  });

  test('It adds a tasting', done => {
    service.createTasting(aTastingCreate)
      .subscribe(result => {
        expect(result).toEqual(aTasting);
        done();
      });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(aTastingCreate);
    req.flush(aTastingApi);
  });

  test('It gets a tasting by ID', done => {
    service.getTasting(1)
      .subscribe(result => {
        expect(result).toEqual(aTastingApi);
        done();
      });

    const req = httpTestingController.expectOne(`${url}/1`);
    expect(req.request.method).toEqual('GET');
    req.flush(aTastingApi);
  });

  test('It deletes a tasting', done => {
    service.deleteTasting(1)
      .subscribe(() => {
        done();
      });

    const req = httpTestingController.expectOne(`${url}/1`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
  })


  test('It adds a wine to a tasting', done => {
    const wineCreate: WineTastingWineCreate = {
      wineId: 1,
      position: 2,
      purchasePrice: 129,
    };

    const expectedWine: WineTastingWine = {
      id: 1,
      wineId: 1,
      position: 2,
      purchasePrice: 129,
      averageScore: null,
    };

    service.addWineToTasting(1, wineCreate).subscribe(result => {
      expect(result).toEqual(expectedWine);
      done();
    });

    const req = httpTestingController.expectOne(`${url}/1/wines`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(wineCreate);
    req.flush(expectedWine);
  });

});
