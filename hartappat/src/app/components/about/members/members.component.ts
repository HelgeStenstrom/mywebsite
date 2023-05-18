import {Component, OnInit} from '@angular/core';
import {BackendService, Member, Wine} from "../../../services/backend.service";
import {Observable, EMPTY} from "rxjs";

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
        this.wines = w;

      });

  }


}
