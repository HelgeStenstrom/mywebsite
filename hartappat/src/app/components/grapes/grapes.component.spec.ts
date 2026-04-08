import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GrapesComponent} from './grapes.component';
import {Observable, of} from "rxjs";
import {DebugElement, NO_ERRORS_SCHEMA} from "@angular/core";
import {By} from "@angular/platform-browser";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Grape} from "../../models/common.model";
import {GrapeService} from "../../services/backend/grape.service";
import {provideRouter} from "@angular/router";

/**
 * Find a component
 * TODO: Move this to a helper file
 */
export function findComponent<T>(
  fixture: ComponentFixture<T>,
  selector: string,
): DebugElement {
  return fixture.debugElement.query(By.css(selector));
}

describe('GrapesComponent', () => {
  let component: GrapesComponent;
  let fixture: ComponentFixture<GrapesComponent>;

  const cs: Grape = {id: 1, name: 'Cabernet Sauvignon', color: 'blå', isUsed: false};
  const riesling: Grape = {id: 2, name: 'Riesling', color: 'grön', isUsed: false};

  const grapeServiceStub: Partial<GrapeService> = {
    getGrapes(): Observable<Grape[]> {
      return of([riesling, cs]);
    },


    deleteGrape(id: number): Observable<Grape> {
      // console.log('deleteGrape() within backendServiceStup was called');
      return of({id: 1, name: 'Name', color: 'color', isUsed: false});
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrapesComponent],
      providers: [
        provideRouter([]),
        {provide: GrapeService, useValue: grapeServiceStub},
        {provide: MatDialog, useValue: {}},
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: {}},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GrapesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  describe('Druva subcomponent', () => {

    // See https://testing-angular.com/testing-components-with-children/#unit-test
    it('should have a Druva subcomponent', () => {
      const {debugElement} = fixture;

      const druva = debugElement.query(By.css('app-add-grape'));

      expect(druva).toBeTruthy();
    });

    it('renders the Druva subcomponent', () => {
      const druva = findComponent(fixture, 'app-add-grape');
      expect(druva).toBeTruthy();
    });

  })


  describe('Sorting', () => {

    test('clicking name header sorts grapes by name ascending', () => {
      fixture.detectChanges();
      const nameHeader = fixture.nativeElement.querySelector('[data-test="header-name"]');
      nameHeader.click();
      fixture.detectChanges();

      const cells = fixture.nativeElement.querySelectorAll('[data-test="grape-name"]');
      expect(cells[0].textContent.trim()).toBe('Cabernet Sauvignon');
      expect(cells[1].textContent.trim()).toBe('Riesling');
    });


  })

  describe('Links to the grapes deails page', () => {

    test('grape names are links to the grape info page', () => {
      const links = fixture.nativeElement.querySelectorAll('[data-test="grape-name"] a');
      expect(links).toHaveLength(2);
      expect(links[0].getAttribute('href')).toBe('/grapes/2/info');
      expect(links[1].getAttribute('href')).toBe('/grapes/1/info');
    });

  })

});
