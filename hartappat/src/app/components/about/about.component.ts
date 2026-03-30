import {Component} from '@angular/core';
import {MembersComponent} from "./members/members.component";

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css'],
  imports: [MembersComponent],
})
export class AboutComponent  {}
