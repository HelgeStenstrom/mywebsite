import {Component} from '@angular/core';
import {Wine} from "../../services/backend.service";

@Component({
  selector: 'app-wine',
  templateUrl: './wine.component.html',
  styleUrls: ['./wine.component.css']
})
export class WineComponent {
  wineName = "default name";

  getWine(): Wine {
    return {name:this.wineName, country:'land', systembolaget:123, category:'not implemented'};
  }

}
