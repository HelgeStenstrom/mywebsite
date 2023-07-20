import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from "@angular/common/http";

import { BackendService, Grape, Member, Tasting, Wine } from './backend.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from "@angular/common/http/testing";
import { Observable } from "rxjs";
import { TestScheduler } from "rxjs/testing";

describe('BackendService', () => {

  let backendService: BackendService;
  let testScheduler: TestScheduler;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(
      {
        imports: [HttpClientTestingModule],
        providers: [BackendService],
      }
    );

    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    backendService = TestBed.inject(BackendService);
    httpTestingController = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('is created', () => {
    expect(backendService).toBeTruthy();
  });

  describe('Grapes', () => {

    const aGrape: Grape = {name: 'grape1', color: 'pink'};
    let url: string;

    beforeEach(() => {
      url = backendService.urlBase + 'api/v1/' + 'grapes';
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

      const req = httpTestingController.expectOne(`${url}/${aGrape.name}`);
      expect(req.request.method).toEqual('DELETE');
      req.flush(aGrape);

    });


  });

  describe('Wines', () => {

    const aWine: Wine = {name: 'N', country: 'Country', category: 'Cat', systembolaget: 1234};
    let url: string;

    beforeEach(() => {
      url = backendService.urlBase + 'api/v1/' + 'wines';
    });

    it('calls getWines()', done => {
      const expectedWines: Wine[] = [aWine];

      backendService.getWines()
        .subscribe(result => {
          expect(result).toEqual(expectedWines);
          done();
        });

      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(expectedWines);
    });
  });

  describe('Members', () => {

    it('calls getMembers()', done => {

      const aMemberFromBackend = {Förnamn: 'Nomen', Efternamn: 'Nescio'};
      const membersFromBackend = [aMemberFromBackend];
      const expectedMember: Member = {given: 'Nomen', surname: 'Nescio'};
      const expectedMembers = [expectedMember];

      const url = backendService.urlBase + 'api/v1/' + 'members';

      backendService.getMembers$()
        .subscribe(result => {
          expect(result).toEqual(expectedMembers);
          done();
        });

      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(membersFromBackend);

    });

  });

  describe('Tastings', () => {

    it('calls getTastings()', done => {

      const aTasting: Tasting = {title: 'A title', notes: 'some notes', date: 'a date, like 2023-07-20'}
      const expectedTastings = [aTasting];

      backendService.getTastings()
        .subscribe(result => {
          expect(result).toEqual(expectedTastings);
          done();
        });

      const url = backendService.urlBase + 'api/v1/' + 'vinprovning';
      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('GET');
      req.flush(expectedTastings);
    });

  });

});

