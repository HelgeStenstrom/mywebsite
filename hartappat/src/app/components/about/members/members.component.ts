import {Component, OnInit} from '@angular/core';
import {BackendService, Grape, Member, Wine} from "../../../services/backend.service";
import {interval, Observable, EMPTY} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  /*  members: any = [
      {given: "Helge", surname: "Stenström"},
      {given: "Ann-Marie", surname: "Bergström"},
    ];*/

  members: Observable<any[]> = EMPTY;
  examples: Observable<any[]> = EMPTY;
  memSync: Member[] = [];
  wines: Wine[] = [];

  constructor(private service: BackendService) {
  }

  ngOnInit(): void {

    this.members = this.service.getMembers();
    this.examples = this.service.getMembersExample();

    const members1 = this.service.getMembers();

    members1.subscribe((m: Member[]) => {
      console.log("ngOnInit members", m);
    });

    this.service.getMembers()
      .subscribe(m => {
        this.memSync = m;
      });

    this.service.getWines()
      .subscribe((w: Wine[]) => {
        // console.log("Wines: ", w);
        this.wines = w;

      });

  }


}
