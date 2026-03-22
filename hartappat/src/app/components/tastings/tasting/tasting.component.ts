import {Component, Input, OnInit} from '@angular/core';
import {WineTasting} from "../../../models/tasting.model";
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {TastingService} from "../../../services/backend/tasting.service";
import {MemberService} from "../../../services/backend/member.service";
import {WineApi} from "../../../models/wine.model";
import {WineService} from "../../../services/backend/wine.service";

@Component({
  selector: 'app-tasting',
  templateUrl: './tasting.component.html',
  styleUrls: ['./tasting.component.css']
})
export class TastingComponent implements OnInit {

  @Input() tasting?: WineTasting;
  fullTasting$!: Observable<WineTasting>;
  memberNames: Map<number, string> = new Map();
  wineMap: Map<number, WineApi> = new Map();


  constructor(
    private readonly service: TastingService,
    private readonly memberService: MemberService,
    private readonly wineService: WineService,
    private readonly route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    const id = this.tasting?.id ?? Number(this.route.snapshot.paramMap.get('id'));
    this.fullTasting$ = this.service.getTasting(id);

    this.fullTasting$.subscribe(tasting => {
      tasting.wines?.forEach(w => {
        this.wineService.getWine(w.wineId).subscribe(wine => {
          this.wineMap.set(w.wineId, wine);
        });
      });
    });

    this.memberService.getMembers().subscribe(members => {
      members.forEach(m => this.memberNames.set(m.id, m.given));
    });
  }

  onWineAdded(): void {
    const id = this.tasting?.id ?? Number(this.route.snapshot.paramMap.get('id'));
    this.fullTasting$ = this.service.getTasting(id);
  }


  protected deleteWine(id: number) {
    const tastingId = this.tasting?.id ?? Number(this.route.snapshot.paramMap.get('id'));
    this.service.deleteWineFromTasting(tastingId, id).subscribe(() => {
      this.fullTasting$ = this.service.getTasting(tastingId);
    });
  }
}
