import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TastingService} from "../../../services/backend/tasting.service";
import {FormsModule} from "@angular/forms";
import {Member} from "../../../models/common.model";
import {MemberService} from "../../../services/backend/member.service";

@Component({
  selector: 'app-edit-tasting',
  imports: [FormsModule],
  templateUrl: './edit-tasting.component.html',
  styleUrl: './edit-tasting.component.css',
})
export class EditTastingComponent implements OnInit {
  title = '';
  notes = '';
  tastingDate = '';
  members: Member[] = [];
  selectedHostIds: Set<number> = new Set();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly tastingService: TastingService,
    private readonly memberService: MemberService,
  ) {
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.tastingService.getTasting(id).subscribe(tasting => {
      this.title = tasting.title;
      this.notes = tasting.notes ?? '';
      this.tastingDate = tasting.tastingDate;
    });

    this.memberService.getMembers().subscribe(members => {
      this.members = members;
    });

    this.tastingService.getTasting(id).subscribe(tasting => {
      this.title = tasting.title;
      this.notes = tasting.notes ?? '';
      this.tastingDate = tasting.tastingDate;
      this.selectedHostIds = new Set((tasting.hosts ?? []).map(h => h.memberId));
    });


  }

  save(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.tastingService.patchTasting(id, {
      title: this.title,
      notes: this.notes,
      tastingDate: this.tastingDate,
    }).subscribe();
    this.tastingService.putHosts(id, Array.from(this.selectedHostIds)).subscribe();
  }

  toggleHost(memberId: number): void {
    console.log("Before: ", this.selectedHostIds);
    if (this.selectedHostIds.has(memberId)) {
      this.selectedHostIds.delete(memberId);
    } else {
      this.selectedHostIds.add(memberId);
    }
    console.log("After: ", this.selectedHostIds);


  }

}
