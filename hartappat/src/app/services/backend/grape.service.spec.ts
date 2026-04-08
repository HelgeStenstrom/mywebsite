import {HttpTestingController, provideHttpClientTesting} from "@angular/common/http/testing";
import {GrapeService} from "./grape.service";
import {TestBed} from "@angular/core/testing";
import {Grape, GrapeCreate} from "../../models/common.model";
import {provideHttpClient} from "@angular/common/http";
import {WineApi} from "../../models/wine.model";

describe('GrapeService', () => {

  let service: GrapeService;
  let httpTestingController: HttpTestingController;
  let url: string;

  const aGrape: Grape = {id: 1, name: 'Grape', color: 'grön', isUsed: false};
  const aGrapeCreate :GrapeCreate = {color: "blå", name: 'Grape'};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GrapeService,provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(GrapeService);
    httpTestingController = TestBed.inject(HttpTestingController);
    url = service.apiBase + '/grapes';
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  test('It gets grapes', done => {
    service.getGrapes()
      .subscribe(result => {
        expect(result).toEqual([aGrape]);
        done();
      });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush([aGrape]);
  });

  test('It gets a grape by id', done => {
    service.getGrape(17)
    .subscribe(result => {
      expect(result).toEqual(aGrape);
      done();
    });

    const req = httpTestingController.expectOne(`${url}/17`);
    expect(req.request.method).toEqual('GET');
    req.flush(aGrape);

  })

  test('It adds a grape', done => {
    service.addGrape(aGrapeCreate)
      .subscribe(result => {
        expect(result).toEqual(aGrape);
        done();
      });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(aGrapeCreate);
    req.flush(aGrape);
  });

  test('It deletes a grape', done => {
    service.deleteGrape(1)
      .subscribe(() => {
        done();
      });

    const req = httpTestingController.expectOne(`${url}/1`);
    expect(req.request.method).toEqual('DELETE');
    req.flush(null);
  })

  test('It patches a grape', done => {
    service.patchGrape(1, aGrapeCreate)
      .subscribe(result => {
        expect(result).toEqual(aGrape);
        done();
      });

    const req = httpTestingController.expectOne(`${url}/1`);
    expect(req.request.method).toEqual('PATCH');
    expect(req.request.body).toEqual(aGrapeCreate);
    req.flush(aGrape);

  })

  test('It gets wines by grape id', done => {
    const aWine: WineApi = {
      id: 17,
      name: 'Testvin',
      grapes: [],
      isUsed: false,
      isNonVintage: false,
      systembolaget: undefined,
      volume: undefined,
      vintageYear: null,
      createdAt: undefined,
      country: {id: 1, name: 'Testland'},
      wineType: {id: 1, name: 'Rött'}
    };

    service.getWinesByGrapeId(42)
      .subscribe(result => {
        expect(result).toEqual([aWine]);
        done();
      });

    const req = httpTestingController.expectOne(`${url}/42/wines`);
    expect(req.request.method).toEqual('GET');
    req.flush([aWine]);
  });

})
