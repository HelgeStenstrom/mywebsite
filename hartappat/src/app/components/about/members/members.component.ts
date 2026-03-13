import {Component, OnInit} from '@angular/core';
import {BackendService} from "../../../services/backend/backend.service";
import {EMPTY, Observable} from "rxjs";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {

  members$: Observable<any[]> = EMPTY;

  constructor(private service: BackendService) {
  }

  ngOnInit(): void {

    this.members$ = this.service.getMembers$();
  }


}
