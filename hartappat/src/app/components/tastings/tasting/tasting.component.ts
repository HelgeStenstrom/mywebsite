import {Component, Input, OnInit} from '@angular/core';
import {WineTasting} from "../../../models/tasting.model";
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {TastingService} from "../../../services/backend/tasting.service";
import {MemberService} from "../../../services/backend/member.service";

@Component({
  selector: 'app-tasting',
  templateUrl: './tasting.component.html',
  styleUrls: ['./tasting.component.css']
})
export class TastingComponent implements OnInit {

  @Input() tasting?: WineTasting;
  fullTasting$!: Observable<WineTasting>;
  memberNames: Map<number, string> = new Map();


  constructor(
    private readonly service: TastingService,
    private readonly memberService: MemberService,
    private readonly route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    const id = this.tasting?.id ?? Number(this.route.snapshot.paramMap.get('id'));
    this.fullTasting$ = this.service.getTasting(id);

    this.memberService.getMembers().subscribe(members => {
      members.forEach(m => this.memberNames.set(m.id, m.given));
    });
  }

  onWineAdded(): void {
    const id = this.tasting?.id ?? Number(this.route.snapshot.paramMap.get('id'));
    this.fullTasting$ = this.service.getTasting(id);
  }


}
