import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {GrapeService} from "./grape.service";
import {TestBed} from "@angular/core/testing";
import {Grape, GrapeCreate} from "../../models/common.model";

describe('GrapeService', () => {

  let service: GrapeService;
  let httpTestingController: HttpTestingController;
  let url: string;

  const aGrape: Grape = {id: 1, name: 'Grape', color: 'grön'};
  const aGrapeCreate :GrapeCreate = {color: "blå", name: 'Grape'};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GrapeService],
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
    service.patchGrape(1, aGrape)
      .subscribe(result => {
        expect(result).toEqual(aGrape);
        done();
      });

    const req = httpTestingController.expectOne(`${url}/1`);
    expect(req.request.method).toEqual('PATCH');
    expect(req.request.body).toEqual(aGrape);
    req.flush(aGrape);

  })

})
