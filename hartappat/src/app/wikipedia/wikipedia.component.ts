import { Component, OnInit } from '@angular/core';
import {WikipediaService} from "../services/wikipedia.service";

@Component({
  selector: 'app-wikipedia',
  templateUrl: './wikipedia.component.html',
  styleUrls: ['./wikipedia.component.css']
})
export class WikipediaComponent implements OnInit {
  private service: WikipediaService;
  mostReadTitle = '';

  constructor(service: WikipediaService) {
    this.service = service;
  }

  ngOnInit(): void {

    this.service.getAnnounce()
      .subscribe(a => {
        // console.log("From Wikipedia: ", a);
      });

    this.service.getPage('Sex')
      .subscribe(a => {
        // console.log("Wikipedia Page metadata: ", a);
      });

    this.service.getFeatured()
      .subscribe(a => {
        //console.log("Wikipedia's most read': ", a);
        // console.log("Wikipedia's most read': ", a.mostread.articles[0].title);
        this.mostReadTitle =  a.mostread.articles[0].displaytitle;
        const innerHTML = a.mostread.articles[0].displaytitle;
        const elementById = document.getElementById('mostRead');
        if (elementById !== null) {
          elementById.innerHTML = innerHTML;
        }

      });

  }

}
