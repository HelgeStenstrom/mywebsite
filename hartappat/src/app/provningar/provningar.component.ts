import {Component, OnInit} from '@angular/core';
import {BackendService} from "../backend.service";

@Component({
  selector: 'app-provningar',
  templateUrl: './provningar.component.html',
  styleUrls: ['./provningar.component.css']
})
export class ProvningarComponent implements OnInit {
  aTastingTitle = "Platshållare för provningsrubrik";
  aTastingNotes= '';

  constructor(private service: BackendService) { }

  ngOnInit(): void {

    this.service.getLatestTasting().subscribe(
      (t) => {
        this.aTastingTitle = t[0].title;
        this.aTastingNotes = t[0].notes;
      }
    );
  }

}
