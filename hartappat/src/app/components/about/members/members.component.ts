import {Component, OnInit} from '@angular/core';
import {EMPTY, Observable} from "rxjs";
import {MemberService} from "../../../services/backend/member.service";
import {Member} from "../../../models/common.model";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
  imports: [AsyncPipe],
})
export class MembersComponent implements OnInit {

  members$: Observable<Member[]> = EMPTY;

  constructor(private readonly service: MemberService) {
  }

  ngOnInit(): void {

    this.members$ = this.service.getMembers();
  }


}
