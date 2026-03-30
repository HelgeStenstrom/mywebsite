import {Component} from '@angular/core';
import {VinmonopoletComponent} from "../vinmonopolet/vinmonopolet.component";
import {WikipediaComponent} from "../wikipedia/wikipedia.component";

@Component({
  selector: 'app-testbench',
  templateUrl: './testbench.component.html',
  styleUrls: ['./testbench.component.css'],
  imports: [
    VinmonopoletComponent,
    WikipediaComponent
  ]
})
export class TestbenchComponent {
}
