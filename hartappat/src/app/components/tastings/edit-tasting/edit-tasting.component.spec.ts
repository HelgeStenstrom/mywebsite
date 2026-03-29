import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EditTastingComponent} from './edit-tasting.component';

describe('EditTastingComponent', () => {
  let component: EditTastingComponent;
  let fixture: ComponentFixture<EditTastingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTastingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTastingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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

});
