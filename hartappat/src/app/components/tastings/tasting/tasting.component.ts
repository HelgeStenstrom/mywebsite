import {Component, Input, OnInit} from '@angular/core';
import {WineTasting, WineTastingWine} from "../../../models/tasting.model";
import {Observable, of} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {TastingService} from "../../../services/backend/tasting.service";
import {MemberService} from "../../../services/backend/member.service";
import {WineApi, WineView} from "../../../models/wine.model";
import {WineService} from "../../../services/backend/wine.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
    selector: 'app-tasting',
    templateUrl: './tasting.component.html',
    styleUrls: ['./tasting.component.css'],
    standalone: false
})
export class TastingComponent implements OnInit {

  @Input() tasting?: WineTasting;
  fullTasting$!: Observable<WineTasting>;
  memberNames: Map<number, string> = new Map();
  wineMap: Map<number, WineApi> = new Map();
  editingId: number | null = null;
  editValues: Partial<WineTastingWine> = {};
  wineSearchTerm = '';
  allWines: WineView[] = [];
  filteredWines: WineView[] = [];
  currentWines: WineTastingWine[] = [];

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
      this.currentWines = tasting.wines ?? [];
      this.updateWineMap(tasting);
    });

    this.memberService.getMembers().subscribe(members => {
      members.forEach(m => this.memberNames.set(m.id, m.given));
    });

    this.wineService.getWines().subscribe(wines => {
      this.allWines = wines;
    })
  }

  private updateWineMap(tasting: WineTasting) {
    this.wineMap.clear();
    tasting.wines?.forEach(w => {
      this.wineService.getWine(w.wineId).subscribe(wine => {
        this.wineMap.set(w.wineId, wine);
      });
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

  startEdit(w: WineTastingWine): void {
    this.editingId = w.id;
    this.editValues = { position: w.position, purchasePrice: w.purchasePrice, averageScore: w.averageScore };
  }

  isEditing(id: number): boolean {
    return this.editingId === id;
  }

  saveEdit(id: number): void {
    this.service.patchWineInTasting(this.getTastingId(), id, this.editValues).subscribe(() => {
      this.editingId = null;
      this.reloadTasting();
    });
  }

  protected cancelEdit() {
    this.editingId = null;
  }

  private getTastingId(): number {
    return this.tasting?.id ?? Number(this.route.snapshot.paramMap.get('id'));
  }

  updateWineFilter() {
    this.filteredWines = this.allWines.filter(
      w => w.name
        .toLowerCase()
        .includes(this.wineSearchTerm.toLowerCase()));
  }

  protected selectWine(wine: WineView) {
    this.editValues.wineId = wine.id;
    this.wineSearchTerm = wine.name;
    this.filteredWines = [];
  }


  sortedWines(): WineTastingWine[] {
    return [...this.currentWines].sort((a, b) => {
      if (a.position === null) return 1;
      if (b.position === null) return -1;
      return a.position - b.position;
    });
  }

  onDrop(event: CdkDragDrop<WineTastingWine[]>): void {
    const wines = this.sortedWines();
    moveItemInArray(wines, event.previousIndex, event.currentIndex);
    const positions = wines
      .filter(w => w.position !== null)
      .map((w, i) => ({ id: w.id, position: i + 1 }));
    this.service.putWinePositions(this.getTastingId(), positions).subscribe(() => {
      this.reloadTasting();
    });
  }

  private reloadTasting(): void {
    const id = this.getTastingId();
    this.service.getTasting(id).subscribe(tasting => {
      this.fullTasting$ = of(tasting);
      this.currentWines = tasting.wines ?? [];
      this.updateWineMap(tasting);
    });
  }


}
