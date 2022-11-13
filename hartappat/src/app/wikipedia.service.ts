import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

// See https://en.wikipedia.org/api/rest_v1/

@Injectable({
  providedIn: 'root'
})
export class WikipediaService {

  constructor(private http:HttpClient) { }

  getAnnounce(): Observable<WikiAnnounce> {
    const url: string = 'https://en.wikipedia.org/api/rest_v1/feed/announcements';
    return this.http.get<WikiAnnounce>(url);
  }

  getPage(page: string): Observable<WikiPageMeta> {
    const url: string = 'https://en.wikipedia.org/api/rest_v1/page/title/' + page;
    return this.http.get<WikiPageMeta>(url);
  }

  getFeatured(): Observable<Featured> {
    const now = Date.now();
    const today = new Date(now);
    console.log("Idag är det ", today);
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let date = today.getDate();
    console.log("YMD: ", year, month, date);
    const url: string = `https://sv.wikipedia.org/api/rest_v1/feed/featured/${year}/${month}/${date}`;
    return this.http.get<Featured>(url);
  }
}

export type WikiAnnounce = {
  announce: any[]
};

export type WikiPageMeta = any;

export type Featured = {mostread: { articles:[{ title:string, displaytitle: string; }] }};
