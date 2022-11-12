import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http:HttpClient) { }

  getWines(): Promise<Wine[]> {
    console.log('BackendService.getData() called');
    let url: string;
    url = 'http://localhost:3000/wines';
    url = 'http://helges-mbp-2:3000/wines'
    const req: Observable<Wine[]> = this.http.get(url) as Observable<Wine[]> ;
    return firstValueFrom(req);
  }

   getGrapes(): Promise<Grape[]> {
    console.log('BackendService.getData() called');
    let url: string;
    url = 'http://localhost:3000/grapes';
    url = 'http://helges-mbp-2:3000/grapes'
    const req: Observable<Grape[]> = this.http.get(url) as Observable<Grape[]> ;
    return firstValueFrom(req);
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
