import {Component, OnInit} from '@angular/core';
import {BackendService, Tasting} from "../backend.service";

@Component({
  selector: 'app-provningar',
  templateUrl: './provningar.component.html',
  styleUrls: ['./provningar.component.css']
})
export class ProvningarComponent implements OnInit {
  tasting: Tasting =  {title: 'Platshållare för provningsrubrik', notes: 'Plats för noteringar'};
  tastings: Tasting[] = [];

  constructor(private service: BackendService) { }

  ngOnInit(): void {

    this.service.getLatestTasting().subscribe(
      (t) => {
        this.tasting = t[0];
        this.tastings = t;
      }
    );
  }

}
