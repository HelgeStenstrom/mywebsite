import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {environment} from "../../../environments/environment";

import {Grape} from '../../models/common.model';


@Injectable({
  providedIn: 'root'
})
export class BackendService {

  public readonly apiBase = environment.apiUrl + '/api/v1';

  /**
   * Subject baserat på https://stackoverflow.com/questions/40313770/how-to-trigger-function-from-one-component-to-another-in-angular2
   */
  private readonly grapesSubject: Subject<Grape> = new Subject<Grape>();

  constructor(private readonly http: HttpClient) {
  }

  newEvent(event: Grape): void {
    this.grapesSubject.next(event);
  }

  get events() {
    return this.grapesSubject.asObservable();
  }


}


