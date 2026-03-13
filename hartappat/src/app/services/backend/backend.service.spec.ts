import {TestBed} from '@angular/core/testing';

import {BackendService,} from './backend.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Observable} from "rxjs";
import {TestScheduler} from "rxjs/testing";
import {WineService} from "./wine.service";
import {Grape} from "../../models/common.model";

describe('BackendService', () => {

  let backendService: BackendService;
  let wineService: WineService;
  let testScheduler: TestScheduler;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(
      {
        imports: [HttpClientTestingModule],
        providers: [BackendService, WineService],
      }
    );

    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    backendService = TestBed.inject(BackendService);
    wineService = TestBed.inject(WineService);
    httpTestingController = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('is created', () => {
    expect(backendService).toBeTruthy();
  });

  describe('Grapes', () => {

    const aGrape: Grape = {id: -1, name: 'grape1', color: 'pink'};
    let url: string;

    beforeEach(() => {
      url = backendService.apiBase + '/grapes';
    });

    it('gets the grapes', done => {
      const grapes$: Observable<Grape[]> = backendService.getGrapes();

      const expectedGrapes: Grape[] = [aGrape];

      grapes$.subscribe(result => {
        expect(result).toEqual(expectedGrapes);
        done();
      });

      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(expectedGrapes);

    });

    it('adds a Grape', done => {

      backendService.addGrape(aGrape)
        .subscribe(() => {
          done();
        });

      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(aGrape);
      req.flush(aGrape);

    });

    it('deletes a Grape', done => {

      backendService.deleteGrape(aGrape)
        .subscribe(result => {
          expect(result).toEqual(aGrape);
          done();
        });

      const req = httpTestingController.expectOne(`${url}/${aGrape.id}`);
      expect(req.request.method).toEqual('DELETE');
      req.flush(aGrape);

    });


  });



});

