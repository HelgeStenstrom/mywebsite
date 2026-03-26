import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MemberService} from "../../../services/backend/member.service";
import {Member} from "../../../models/common.model";
import {FormsModule} from "@angular/forms";
import {ScoresConfigService} from "../../../services/scores-config.service";
import {ScoresConfig} from "../../../models/score.model";

@Component({
  selector: 'app-scores',
  imports: [FormsModule],
  templateUrl: './scores.component.html',
  styleUrl: './scores.component.css',
})
export class ScoresComponent implements OnInit {

  tastingId: number = 0;
  members: Member[] = [];
  participants: Member[] = [];
  numberOfPositions: number = 6;
  scores: Record<number, Record<number, number | null>> = {};

  constructor(
    private readonly route: ActivatedRoute,
    private readonly memberService: MemberService,
    private readonly scoresConfigService: ScoresConfigService
    ) {
  }

  ngOnInit(): void {
    this.tastingId = Number(this.route.snapshot.paramMap.get('id'));
    this.memberService.getMembers().subscribe(members => {
      this.members = members;

      const config = this.scoresConfigService.loadConfig(this.tastingId);
      if (config) {
        this.numberOfPositions = config.numberOfPositions;
        this.participants = this.members.filter(m =>
          config.participantIds.includes(m.id)
        ).sort((a, b) =>
          config.participantIds.indexOf(a.id) - config.participantIds.indexOf(b.id)
        );
      }
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
    this.onConfigChanged();
  }


  get positions(): number[] {
    return Array.from({ length: this.numberOfPositions }, (_, i) => i + 1);
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
    this.onConfigChanged();
  }

  moveDown(index: number): void {
    if (index < this.participants.length - 1) {
      [this.participants[index], this.participants[index + 1]] =
        [this.participants[index + 1], this.participants[index]];
    }
    this.onConfigChanged();
  }

  protected readonly HTMLInputElement = HTMLInputElement;

  protected clampScore(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    if (input.value && value > 20) {
      input.value = '20';
    } else if (input.value && value < 1) {
      input.value = '1';
    }
  }

  onConfigChanged() {
    const config: ScoresConfig = {
      numberOfPositions: this.numberOfPositions,
      participantIds: this.participants.map(p => p.id)
    }
    this.scoresConfigService.saveConfig(this.tastingId, config);
  }
}
