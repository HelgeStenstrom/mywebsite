import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {ScoreService} from './score.service';
import {ScoreCreateDto, ScoreDto} from '../../models/score.model';
import {provideHttpClient} from '@angular/common/http';

describe('ScoreService', () => {

  let service: ScoreService;
  let httpTestingController: HttpTestingController;
  let url: string;

  const aScore: ScoreDto = {id: 1, tastingId: 5, memberId: 1, position: 1, score: 15};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScoreService,
        provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ScoreService);
    httpTestingController = TestBed.inject(HttpTestingController);
    url = service.apiBase + '/tastings/5/scores';
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  test('it gets scores for a tasting', done => {
    service.getScores(5).subscribe(result => {
      expect(result).toEqual([aScore]);
      done();
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush([aScore]);
  });

  test('it posts a score', done => {
    const newScore: ScoreCreateDto = {memberId: 1, position: 1, score: 15};

    service.postScore(5, newScore).subscribe(result => {
      expect(result).toEqual(aScore);
      done();
    });

    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(newScore);
    req.flush(aScore);
  });
});
