import {WineService} from "./wine.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {WineApi, WineCreate, WineGrape, WineGrapeCreate, WineView} from "../../models/wine.model";
import {TestBed} from "@angular/core/testing";


describe('WineService', () => {

  let service: WineService;
  let httpTestingController: HttpTestingController;
  let url: string;

  const aWineApi: WineApi = {
    id: 1,
    name: 'Testvin',
    country: {id: 1, name: 'Sverige'},
    wineType: {id: 1, name: 'Rött'},
    vintageYear: 2020,
    isNonVintage: false,
    isUsed: false,
  };
  const aWineCreate: WineCreate = {
    name: 'Testvin',
    countryId: 1,
    wineTypeId: 1,
    vintageYear: 2020,
    isNonVintage: false,
  };

  const aWineView: WineView = {
    id: 1,
    name: 'Testvin',
    country: 'Sverige',
    wineType: 'Rött',
    vintage: '2020',
    isUsed: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WineService],
    });
    service = TestBed.inject(WineService);
    httpTestingController = TestBed.inject(HttpTestingController);
    url = service.apiBase + '/wines';
  });

  afterEach(() => {
    httpTestingController.verify();
  });


  test('Dummy',()=> {
    expect(true).toBe(true);
  })

  test('It gets wines', done => {
    service.getWines()
      .subscribe(result => {
        expect(result).toEqual([aWineView]);
        done();
      });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush([aWineApi]);
  });

  test('It adds a wine', done => {
    service.addWine(aWineCreate)
      .subscribe(result => {
        expect(result).toEqual(aWineView);
        done();
      });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(aWineCreate);
    req.flush(aWineView);
  });

  test('It gets a wine by ID', done => {
    service.getWine(1)
      .subscribe(result => {
        expect(result).toEqual(aWineApi);
        done();
      });

    const req = httpTestingController.expectOne(`${url}/1`);
    expect(req.request.method).toEqual('GET');
    req.flush(aWineApi);
  });

  test('It deletes a wine', done => {
    service.deleteWine(aWineView)
    .subscribe(() => {
        done();
      });
    const req = httpTestingController.expectOne(`${url}/1`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
  })

  describe('WineGrapeservice', () => {

    test('returns wine grapes for a given wine id', () => {
      const mockGrapes: WineGrape[] = [
        { id: 1, wineId: 10, grapeId: 3, percentage: 75 },
        { id: 2, wineId: 10, grapeId: 5, percentage: 25 },
      ];

      service.getWineGrapes(10).subscribe(result => {
        expect(result).toEqual(mockGrapes);
      });

      const req = httpTestingController.expectOne(`${url}/10/grapes` );
      expect(req.request.method).toBe('GET');
      req.flush(mockGrapes);
    });



    test('posts grape and returns created wine grape', () => {
      const toCreate: WineGrapeCreate = { grapeId: 3, percentage: 75 };
      const mockResponse: WineGrape = { id: 1, wineId: 10, grapeId: 3, percentage: 75 };

      service.addWineGrape(10, toCreate).subscribe(result => {
        expect(result).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(`${url}/10/grapes`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(toCreate);
      req.flush(mockResponse, { status: 201, statusText: 'Created' });
    });

    test('deletes a wine grape', () => {
      const wineId = 10;
      service.deleteWineGrape(wineId, 1).subscribe();

      const wineGrapeId = 1;
      const req = httpTestingController.expectOne(`${url}/${wineId}/grapes/${wineGrapeId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null, { status: 204, statusText: 'No Content' });
    });

  })

});
