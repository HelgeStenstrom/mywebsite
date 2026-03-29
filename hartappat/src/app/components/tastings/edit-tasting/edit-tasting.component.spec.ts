import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EditTastingComponent} from './edit-tasting.component';
import {of} from "rxjs";
import {ActivatedRoute, convertToParamMap, provideRouter} from "@angular/router";
import {TastingService} from "../../../services/backend/tasting.service";
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('EditTastingComponent', () => {
  let component: EditTastingComponent;
  let fixture: ComponentFixture<EditTastingComponent>;

  const tastingServiceMock = {
    getTasting: jest.fn().mockReturnValue(of({
      id: 1,
      title: 'Testprovning',
      notes: 'Några noter',
      tastingDate: '2024-01-01',
      hosts: [],
      wines: [],
    })),
    patchTasting: jest.fn().mockReturnValue(of(void 0)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTastingComponent],
      providers: [
        provideRouter([]),
        { provide: TastingService, useValue: tastingServiceMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTastingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Inputs and Textareas exist', () => {
    test('displays input for title', () => {
      fixture.detectChanges();
      const titleInput = fixture.nativeElement.querySelector('[data-test="title-input"]');
      expect(titleInput).toBeTruthy();
    });

    test('displays textarea for notes', () => {
      fixture.detectChanges();
      const notesTextarea = fixture.nativeElement.querySelector('[data-test="notes-textarea"]');
      expect(notesTextarea).toBeTruthy();
    });

    test('displays date input for tasting date', () => {
      fixture.detectChanges();
      const dateInput = fixture.nativeElement.querySelector('[data-test="tasting-date-input"]');
      expect(dateInput).toBeTruthy();
    });
  })

  describe('Inputs are prefilled', () => {
    test('title input shows tasting title', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      const titleInput = fixture.nativeElement.querySelector('[data-test="title-input"]');
      expect(titleInput.value).toBe('Testprovning');
    });

    test('notes textarea shows tasting notes', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      const notesTextarea = fixture.nativeElement.querySelector('[data-test="notes-textarea"]');
      expect(notesTextarea.value).toBe('Några noter');
    });

    test('date input shows tasting date', async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      const dateInput = fixture.nativeElement.querySelector('[data-test="tasting-date-input"]');
      expect(dateInput.value).toBe('2024-01-01');
    });
  });

  describe('Save button', () => {

    test('displays save button', () => {
      fixture.detectChanges();
      const saveButton = fixture.nativeElement.querySelector('[data-test="save-button"]');
      expect(saveButton).toBeTruthy();
    });

    test('clicking save button calls patchTasting with updated values', () => {
      tastingServiceMock.patchTasting = jest.fn().mockReturnValue(of(void 0));
      fixture.detectChanges();

      component.title = 'Ny titel';
      component.notes = 'Nya noter';
      component.tastingDate = '2024-06-01';

      const saveButton = fixture.nativeElement.querySelector('[data-test="save-button"]');
      saveButton.click();

      expect(tastingServiceMock.patchTasting).toHaveBeenCalledWith(1, {
        title: 'Ny titel',
        notes: 'Nya noter',
        tastingDate: '2024-06-01',
      });
    });

  })


});
