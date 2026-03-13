import {TestBed} from '@angular/core/testing';

import {BackendService,} from './backend.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {TestScheduler} from "rxjs/testing";
import {WineService} from "./wine.service";

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




});

