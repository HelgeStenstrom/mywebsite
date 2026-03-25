import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MemberService} from "../../../services/backend/member.service";
import {Member} from "../../../models/common.model";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-scores',
  imports: [FormsModule],
  templateUrl: './scores.component.html',
  styleUrl: './scores.component.css',
})
export class ScoresComponent implements OnInit {

  tastingId: number = 0;
  members: Member[] = [];
  selectedMemberIds: Set<number> = new Set();
  numberOfPositions: number = 6;
  scores: Record<number, Record<number, number | null>> = {};

  constructor(
    private readonly route: ActivatedRoute,
    private readonly memberService: MemberService,
    ) {
  }

  ngOnInit(): void {
    this.tastingId = Number(this.route.snapshot.paramMap.get('id'));
    this.memberService.getMembers().subscribe(members => {
      this.members = members;
    });
  }

  isSelected(memberId: number) {
    return this.selectedMemberIds.has(memberId);
  }

  toggleMember(memberId:number) {
    if (this.selectedMemberIds.has(memberId)) {
      this.selectedMemberIds.delete(memberId);
    } else {
      this.selectedMemberIds.add(memberId);
    }
  }


  get positions(): number[] {
    return Array.from({ length: this.numberOfPositions }, (_, i) => i + 1);
  }

  get selectedMembers(): Member[] {
    return this.members.filter(m => this.selectedMemberIds.has(m.id));
  }

  getScore(memberId: number, position: number): number | null {
    return this.scores[memberId]?.[position] ?? null;
  }

  setScore(memberId: number, position: number, value: string): void {
    if (!this.scores[memberId]) {
      this.scores[memberId] = {};
    }
    this.scores[memberId][position] = value ? Number(value) : null;
  }

}
