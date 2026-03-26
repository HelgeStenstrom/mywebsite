import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ScoreCreateDto, ScoreDto} from '../../models/score.model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  public readonly apiBase = environment.apiUrl + '/api/v1';

  constructor(private readonly http: HttpClient) {}

  postScore(tastingId: number, score: ScoreCreateDto): Observable<ScoreDto> {
    return this.http.post<ScoreDto>(`${this.apiBase}/tastings/${tastingId}/scores`, score);
  }

  getScores(tastingId: number): Observable<ScoreDto[]> {
    return this.http.get<ScoreDto[]>(`${this.apiBase}/tastings/${tastingId}/scores`);
  }

  putScores(tastingId: number, score: ScoreCreateDto[]): Observable<ScoreDto> {
    return this.http.put<ScoreDto>(`${this.apiBase}/tastings/${tastingId}/scores`, score);
  }
}
