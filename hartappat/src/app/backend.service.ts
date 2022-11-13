import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  urlBase: string = 'http://helges-mbp-2:3000/';

  constructor(private http:HttpClient) { }

  getWines(): Observable<Wine[]> {
    console.log('BackendService.getData() called');
    const url: string = this.urlBase + 'wines';
    return this.http.get<Wine[]>(url,
      { // Options are not needed in this case; the defaults are OK.
        responseType: 'json',
        observe: 'body',
        reportProgress: false
      });
  }

   getGrapes(): Observable<Grape[]> {
    console.log('BackendService.getData() called');
     const url: string = this.urlBase + 'grapes';
     return this.http.get<Grape[]>(url);
  }


}

export type Wine = {
  name: string;
  country: string;
  vinkategori: string;
};

export type Grape = {
  name: string;
  color: string;
};
