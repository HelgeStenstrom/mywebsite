import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DruvorComponent} from './druvor.component';
import {Observable, of} from "rxjs";
import {DebugElement, NO_ERRORS_SCHEMA} from "@angular/core";
import {By} from "@angular/platform-browser";
import {MatDialog} from "@angular/material/dialog";
import {Grape} from "../../models/common.model";
import {GrapeService} from "../../services/backend/grape.service";

describe('DruvorComponent', () => {
  let druvorComponent: DruvorComponent;
  let fixture: ComponentFixture<DruvorComponent>;

  const cs: Grape = {id: 1, name:'Cabernet Sauvignon', color:'blå'};
  const riesling: Grape = {id: 2, name:'Riesling', color:'grön'};

  const grapeServiceStub: Partial<GrapeService> = {
    getGrapes(): Observable<Grape[]> {
      return of([riesling, cs]);
    },


    deleteGrape(id: number): Observable<Grape> {
      // console.log('deleteGrape() within backendServiceStup was called');
      return of({id: 1, name:'Name', color:'color'});
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DruvorComponent ],
      providers: [
        {provide: GrapeService, useValue: grapeServiceStub},
        {provide: MatDialog, useValue: {}}
      ],
      schemas:[NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DruvorComponent);
    druvorComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders without errors  ', () => {
    expect(druvorComponent).toBeTruthy();
  });





  // See https://testing-angular.com/testing-components-with-children/#unit-test
  it('should have a Druva subcomponent', () => {
    const { debugElement } = fixture;

    const druva = debugElement.query(By.css('app-add-grape'));

    expect(druva).toBeTruthy();
  });

  it('renders the Druva subcomponent', () => {
    const druva = findComponent(fixture, 'app-add-grape');
    expect(druva).toBeTruthy();
  });

  it('should pass', () => {
    expect(1 + 1).toBe(2);
  });

  describe('grapes$ async', () => {

    it('should have Cab', done => {
      druvorComponent.grapes$.subscribe(result => {
        expect(result).toContain(riesling);
        done();
      });
    });

  });

});

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
