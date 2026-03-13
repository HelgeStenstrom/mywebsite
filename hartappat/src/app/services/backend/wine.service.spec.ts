import {WineService} from "./wine.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {WineApi, WineCreate, WineView} from "../../models/wine.model";
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

});
