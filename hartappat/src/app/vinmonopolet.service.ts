import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class VinmonopoletService {

  constructor(private http:HttpClient) { }

  getProductDetails(): Observable<ProductDetail[]> {

    const headers = {
      'Cache-Control': 'no-cache',
      'Ocp-Apim-Subscription-Key': '1ff26063efff409eb6200d72ac584c04',
    };

    const url : string = 'https://apis.vinmonopolet.no/products/v0/details-normal?maxResults=10';
    return this.http.get<ProductDetail[]>(url, {headers: headers});
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

