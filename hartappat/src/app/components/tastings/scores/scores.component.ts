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
  participants: Member[] = [];
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
    return this.participants.some(m => m.id === memberId);
  }

  toggleMember(memberId: number): void {
    if (this.isSelected(memberId)) {
      this.participants = this.participants.filter(m => m.id !== memberId);
    } else {
      const member = this.members.find(m => m.id === memberId);
      if (member) {
        this.participants.push(member);
      }
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

  setScore(memberId: number, position: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    if (!this.scores[memberId]) {
      this.scores[memberId] = {};
    }
    this.scores[memberId][position] = value ? Number(value) : null;
  }

  moveUp(index: number): void {
    if (index > 0) {
      [this.participants[index - 1], this.participants[index]] =
        [this.participants[index], this.participants[index - 1]];
    }
  }

  moveDown(index: number): void {
    if (index < this.participants.length - 1) {
      [this.participants[index], this.participants[index + 1]] =
        [this.participants[index + 1], this.participants[index]];
    }
  }

  protected readonly HTMLInputElement = HTMLInputElement;
}
