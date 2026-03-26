import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {MemberService} from "../../../services/backend/member.service";
import {Member} from "../../../models/common.model";
import {FormsModule} from "@angular/forms";
import {ScoresConfigService} from "../../../services/scores-config.service";
import {ScoreCreateDto, ScoresConfig} from "../../../models/score.model";
import {CdkDragDrop, DragDropModule, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatIconModule} from "@angular/material/icon";
import {ScoreService} from "../../../services/backend/score.service";
import {average, standardDeviation} from "../../../utils/statistics";
import {DecimalPipe} from "@angular/common";
import {TastingService} from "../../../services/backend/tasting.service";

@Component({
  selector: 'app-scores',
  imports: [FormsModule, DragDropModule, MatIconModule, DecimalPipe, RouterLink],
  templateUrl: './scores.component.html',
  styleUrl: './scores.component.css',
})
export class ScoresComponent implements OnInit {

  tastingId: number = 0;
  members: Member[] = [];
  participants: Member[] = [];
  numberOfPositions: number = 6;
  scores: Record<number, Record<number, number | null>> = {};
  tastingTitle: string = '';

  tastingDate: string = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly memberService: MemberService,
    private readonly scoresConfigService: ScoresConfigService,
    private readonly scoreService: ScoreService,
    private readonly tastingService: TastingService,
  ) {
  }

  ngOnInit(): void {
    this.tastingId = Number(this.route.snapshot.paramMap.get('id'));
    this.tastingService.getTasting(this.tastingId).subscribe(tasting => {
      this.tastingTitle = tasting.title;
      this.tastingDate = tasting.tastingDate;
    });

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
    return Array.from({length: this.numberOfPositions}, (_, i) => i + 1);
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

  drop(event: CdkDragDrop<Member[]>): void {
    moveItemInArray(this.participants, event.previousIndex, event.currentIndex);
    this.onConfigChanged();
  }

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

  saveScores(): void {
    const scores: ScoreCreateDto[] = [];
    for (const member of this.participants) {
      for (const position of this.positions) {
        const score = this.getScore(member.id, position);
        if (score !== null) {
          scores.push({ memberId: member.id, position, score });
        }
      }
    }
    this.scoreService.putScores(this.tastingId, scores).subscribe();
  }

  averageForPosition(position: number): number | null {
    const scores = this.participants.map(m => this.getScore(m.id, position));
    const filteredScores = scores.filter(score => score !== null);
    return average(filteredScores);
  }

  averageForMember(memberId: number) {
    const scores = this.positions.map(p => this.getScore(memberId, p));
    const filteredScores = scores.filter(score => score !== null);
    return average(filteredScores);
  }


  standardDeviationForPosition(position: number): number | null {
    const scores = this.participants.map(m => this.getScore(m.id, position));
    const filteredScores = scores.filter(score => score !== null);
    return standardDeviation(filteredScores);
  }

  standardDeviationForMember(memberId: number) {
    const scores = this.positions.map(p => this.getScore(memberId, p));
    const filteredScores = scores.filter(score => score !== null);
    return standardDeviation(filteredScores);
  }


}
