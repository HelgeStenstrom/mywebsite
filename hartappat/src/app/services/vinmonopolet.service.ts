import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { environment } from '../../environments/environment';

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

    const url  = environment.proxyUrl +  '/vinmonopolet';
    // TODO: Ta URL eller åtminstone hostname från en konfigurationsfil.
    //  Mål: kunna testa från andra datorer än localhost, i andra nätverk än hemma.
    // const url  = 'http://192.168.2.140:3001/vinmonopolet';
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

