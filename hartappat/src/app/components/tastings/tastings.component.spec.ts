import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TastingsComponent} from './tastings.component';
import {of} from "rxjs";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {TastingService} from "../../services/backend/tasting.service";
import {WineTastingSummary} from "../../models/tasting.model";
import {provideRouter} from "@angular/router";
import {By} from "@angular/platform-browser";

describe('TastingsComponent', () => {
  let component: TastingsComponent;
  let fixture: ComponentFixture<TastingsComponent>;
  let mockTastingService: jest.Mocked<TastingService>;

  const tastings: WineTastingSummary[] = [
    { id: 1, title: 'Testprovning 1', notes: 'Noter', tastingDate: '2024-01-15', winningWines: [] },
    { id: 2, title: 'Testprovning 2', notes: 'Noter', tastingDate: '2024-02-20', winningWines: [] },
    { id: 3, title: 'Testprovning 3', notes: 'Noter', tastingDate: '2024-03-25', winningWines: [] },
  ];

  beforeEach(async () => {

    mockTastingService = {
      getTastings: jest.fn().mockReturnValue(of(tastings)),
      deleteTasting: jest.fn(),
    } as unknown as jest.Mocked<TastingService>;

    await TestBed.configureTestingModule({
      imports: [TastingsComponent],
      providers: [
        {provide: TastingService, useValue: mockTastingService},
        provideRouter([]),
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TastingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Delete tasting', () => {

    test('checkboxes for deletion are invisible when advanced-toggle is of', () => {
      const toggle = fixture.debugElement.query(By.css('[data-test="advanced-toggle"]'));
      const checkboxes = fixture.debugElement.queryAll(By.css('[data-test="delete-checkbox"]'));

      expect(toggle).toBeTruthy();
      expect(checkboxes.length).toBe(0);
    });

    test('delete checkboxes are shown when advanced toggle is on', () => {
      const toggle = fixture.debugElement.query(By.css('[data-test="advanced-toggle"]'));
      toggle.query(By.css('button')).nativeElement.click();
      fixture.detectChanges();

      const checkboxes = fixture.debugElement.queryAll(By.css('[data-test="delete-checkbox"]'));
      expect(checkboxes.length).toBe(3);
    });

    test('confirm delete buttons are disabled when no checkboxes are checked', () => {
      const toggle = fixture.debugElement.query(By.css('[data-test="advanced-toggle"]'));
      toggle.query(By.css('button')).nativeElement.click();
      fixture.detectChanges();

      const confirmButtons = fixture.debugElement.queryAll(By.css('[data-test="confirm-delete-button"]'));
      expect(confirmButtons.length).toBe(3);
      confirmButtons.forEach(btn => expect(btn.nativeElement.disabled).toBe(true));
    });

    test('checking a delete checkbox adds the tasting id to selected ids', () => {
      const toggle = fixture.debugElement.query(By.css('[data-test="advanced-toggle"]'));
      toggle.query(By.css('button')).nativeElement.click();
      fixture.detectChanges();

      const checkbox = fixture.debugElement.query(By.css('[data-test="delete-checkbox"]'));
      checkbox.nativeElement.click();
      fixture.detectChanges();

      const confirmButton = fixture.debugElement.query(By.css('[data-test="confirm-delete-button"]'));
      expect(confirmButton.nativeElement.disabled).toBe(false);
    });

    test('clicking confirm delete button calls deleteTasting for the selected tasting', () => {
      mockTastingService.deleteTasting.mockReturnValue(of(undefined));

      const toggle = fixture.debugElement.query(By.css('[data-test="advanced-toggle"]'));
      toggle.query(By.css('button')).nativeElement.click();
      fixture.detectChanges();

      const checkboxes = fixture.debugElement.queryAll(By.css('[data-test="delete-checkbox"]'));
      checkboxes[0].nativeElement.click();
      fixture.detectChanges();

      const confirmButtons = fixture.debugElement.queryAll(By.css('[data-test="confirm-delete-button"]'));
      confirmButtons[0].nativeElement.click();
      fixture.detectChanges();

      expect(mockTastingService.deleteTasting).toHaveBeenCalledTimes(1);
      expect(mockTastingService.deleteTasting).toHaveBeenCalledWith(tastings[0].id);
    });

    test('deleted tasting is removed from the list after confirm delete', () => {
      mockTastingService.deleteTasting.mockReturnValue(of(undefined));

      const toggle = fixture.debugElement.query(By.css('[data-test="advanced-toggle"]'));
      toggle.query(By.css('button')).nativeElement.click();
      fixture.detectChanges();

      const checkboxes = fixture.debugElement.queryAll(By.css('[data-test="delete-checkbox"]'));
      checkboxes[0].nativeElement.click();
      fixture.detectChanges();

      const confirmButtons = fixture.debugElement.queryAll(By.css('[data-test="confirm-delete-button"]'));
      confirmButtons[0].nativeElement.click();
      fixture.detectChanges();

      const rows = fixture.debugElement.queryAll(By.css('[data-test="tasting-row"]'));
      expect(rows.length).toBe(2);
    });



  });

  describe('Winning wines', () => {

    test('displays winning wine name in tasting row', async () => {
      const tastingsWithWinner: WineTastingSummary[] = [
        {
          id: 1,
          title: 'Testprovning 1',
          notes: 'Noter',
          tastingDate: '2024-01-15',
          winningWines: [{ wineId: 7, wineName: 'Château Vadeau', averageScore: 15, tastingWineId: -1 }],
        },
      ];
      mockTastingService.getTastings.mockReturnValue(of(tastingsWithWinner));

      fixture = TestBed.createComponent(TastingsComponent);
      fixture.detectChanges();
      await fixture.whenStable();

      const winnerCell = fixture.debugElement.query(By.css('[data-test="winning-wine"]'));
      expect(winnerCell.nativeElement.textContent).toContain('Château Vadeau');
    });

    test('displays multiple winning wines separated by commas', async () => {
      const tastingsWithWinner: WineTastingSummary[] = [
        {
          id: 1,
          title: 'Testprovning 1',
          notes: 'Noter',
          tastingDate: '2024-01-15',
          winningWines: [
            { wineId: 7, wineName: 'Château Vadeau', averageScore: 15, tastingWineId: -1 },
            { wineId: 8, wineName: 'Villa Testino', averageScore: 15, tastingWineId: -1 },
          ],
        },
      ];
      mockTastingService.getTastings.mockReturnValue(of(tastingsWithWinner));

      fixture = TestBed.createComponent(TastingsComponent);
      fixture.detectChanges();
      await fixture.whenStable();

      const winnerCell = fixture.debugElement.query(By.css('[data-test="winning-wine"]'));
      expect(winnerCell.nativeElement.textContent).toContain('Château Vadeau, Villa Testino');
    });

    test('the winning wine name is a link to the tasting wine page', async () => {
      const tastingsWithWinner: WineTastingSummary[] = [
        {
          id: 3,
          title: 'Testprovning',
          notes: 'Noter',
          tastingDate: '2024-01-15',
          winningWines: [{wineId: 7, wineName: 'Château Vadeau', averageScore: 15, tastingWineId: 5}],
        },
      ];
      mockTastingService.getTastings.mockReturnValue(of(tastingsWithWinner));

      fixture = TestBed.createComponent(TastingsComponent);
      fixture.detectChanges();
      await fixture.whenStable();

      const link = fixture.nativeElement.querySelector('[data-test="winning-wine"] a');
      expect(link).not.toBeNull();
      expect(link.getAttribute('href')).toBe('/tastings/3/wines/5');
    });

  })

});

