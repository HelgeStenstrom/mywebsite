import { Component, OnInit } from '@angular/core';
import {WikipediaService} from "../../services/wikipedia.service";

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
      });

    this.service.getPage('Sex')
      .subscribe(a => {
      });

    this.service.getFeatured()
      .subscribe(a => {
        this.mostReadTitle =  a.tfa.displaytitle;
        const innerHTML = a.tfa.displaytitle;
        const elementById = document.getElementById('mostRead');
        if (elementById !== null) {
          elementById.innerHTML = innerHTML;
        }

      });

  }

}
