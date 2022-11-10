import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http:HttpClient) { }

  getData(): Promise<Wine[]> {
    console.log('BackendService.getData() called');
    let url: string;
    url = 'http://localhost:3000/wines';
    url = 'http://helges-mbp-2:3000/wines'
    const req: Observable<Wine[]> = this.http.get(url) as Observable<Wine[]> ;
    return firstValueFrom(req);
  }
}

export type Wine = {
  name: number;
  country:string;
  vinkategori:string;
}
