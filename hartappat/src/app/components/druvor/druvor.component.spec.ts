import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DruvorComponent} from './druvor.component';
import {BackendService, Grape} from "../../services/backend.service";
import {Observable, of, Subscription} from "rxjs";
import {DebugElement, NO_ERRORS_SCHEMA} from "@angular/core";
import {By} from "@angular/platform-browser";
import {MatDialog} from "@angular/material/dialog";

describe('DruvorComponent', () => {
  let druvorComponent: DruvorComponent;
  let fixture: ComponentFixture<DruvorComponent>;

  const cs: Grape = {name:'Cabernet Sauvignon', color:'blå'};
  const riesling: Grape = {name:'Riesling', color:'grön'};

  const backendServiceStub: Partial<BackendService> = {
    getGrapes(): Observable<Grape[]> {
      // console.log('getGrapes() within backendServiceStup was called');

      return of([riesling, cs]);
    },

    get events(): Observable<Grape> {
      return of({name:'a name', color: 'a color'})
    },

    deleteGrape(grape: Grape): Observable<Grape> {
      // console.log('deleteGrape() within backendServiceStup was called');
      return of({name:'Name', color:'color'});
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DruvorComponent ],
      providers: [
        {provide: BackendService, useValue: backendServiceStub},
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

  describe('edit', () => {

    beforeEach(() => {
     spyOn<Partial<BackendService>, any>(backendServiceStub, 'deleteGrape');
     //spyOn<Partial<BackendService>, any>(backendServiceStub, 'getGrape');
    });

    it('should pass too', () => {
      expect(1 + 1).toBe(2);
    });

    // TODO: Fix this test so that it works!
    xit('should call delete', (done) => {
      const grape = {name: 'NAME from test', color: 'COLOR'};
      druvorComponent.deleteGrape(grape);
      expect(backendServiceStub.deleteGrape).toHaveBeenCalled();
      // backendServiceStub.deleteGrape is asynchronous; DruvorComponent.deleteGrape is not.
      done();
    });

  });

  xdescribe('non-async', () => {

    xit('should have Cab and Riesling', () => {
      // expect(druvorComponent.grapes).toContain(cs);
      // expect(druvorComponent.grapes).toContain(riesling);
    });
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
