import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom, Observable} from "rxjs";
import {Wine} from "./backend.service";

@Injectable({
  providedIn: 'root'
})
export class VinmonopoletService {

  constructor(private http:HttpClient) { }

  getProductDetails(): Promise<ProductDetail[]> {

    const h = {
      'Cache-Control': 'no-cache',
      'Ocp-Apim-Subscription-Key': '1ff26063efff409eb6200d72ac584c04',
    };

    const url : string = 'https://apis.vinmonopolet.no/products/v0/details-normal?maxResults=10';
    const req: Observable<ProductDetail[]> = this.http.get(url, {headers:h}) as Observable<ProductDetail[]> ;
    return firstValueFrom(req);
  }
}

export type ProductDetail = {
  basic: BasicProductDetail;
  lastChanged: any
}

export type BasicProductDetail = {
  productId: string;
  productShortName: string;
}

