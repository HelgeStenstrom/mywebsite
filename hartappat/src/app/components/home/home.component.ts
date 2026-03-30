import {Component} from '@angular/core';
import {VinmonopoletComponent} from "../vinmonopolet/vinmonopolet.component";
import {AboutComponent} from "../about/about.component";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
  imports: [VinmonopoletComponent, AboutComponent],
})
export class HomeComponent {}
