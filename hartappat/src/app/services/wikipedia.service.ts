import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { environment } from '../../environments/environment';

// See https://en.wikipedia.org/api/rest_v1/

@Injectable({
  providedIn: 'root'
})
export class WikipediaService {

  constructor(private http:HttpClient) { }

  getAnnounce(): Observable<WikiAnnounce> {
    const url = 'https://en.wikipedia.org/api/rest_v1/feed/announcements';
    return this.http.get<WikiAnnounce>(url);
  }

  getPage(page: string): Observable<WikiPageMeta> {
    const url: string = 'https://en.wikipedia.org/api/rest_v1/page/title/' + page;
    return this.http.get<WikiPageMeta>(url);
  }

  getFeatured(): Observable<Featured> {
    const urlViaProxy = environment.proxyUrl +  '/featured';
    console.log("urlViaProxy = ", urlViaProxy);
    //const urlViaProxy = 'http://localhost:3001/featured';
    return this.http.get<Featured>(urlViaProxy);
  }
}

export type WikiAnnounce = {
  announce: any[]
};

export type WikiPageMeta = any;

export type Featured = {mostread: { articles:[{ title:string, displaytitle: string; }] }};
