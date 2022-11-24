import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DruvorComponent } from './druvor.component';
import {BackendService, Grape} from "../backend.service";
import {Observable, of} from "rxjs";
import {DebugElement, NO_ERRORS_SCHEMA} from "@angular/core";
import {By} from "@angular/platform-browser";

describe('DruvorComponent test with mock', () => {
  let druvorComponent: DruvorComponent;
  let fixture: ComponentFixture<DruvorComponent>;

  const cs: Grape = {name:'Cabernet Sauvignon', color:'blå'};

  const backendServiceStub: Partial<BackendService> = {
    getGrapes(): Observable<Grape[]> {
      const r: Grape = {name:'Riesling', color:'grön'};
      return of([r, cs]);
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DruvorComponent ],
      providers: [{provide: BackendService, useValue: backendServiceStub}],
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

  it('should have Riesling', () => {
    const r: Grape = {name: 'Riesling', color: 'grön'};
    expect(druvorComponent.grapes).toContain(r);
  });

  it('should have Cab', () => {
    expect(druvorComponent.grapes).toContain(cs);
  });

  // See https://testing-angular.com/testing-components-with-children/#unit-test
  it('should have a Druva subcomponent', () => {
    const { debugElement } = fixture;

    const druva = debugElement.query(By.css('app-druva'));

    expect(druva).toBeTruthy();
  });

  it('renders the Druva subcomponent', () => {
    const druva = findComponent(fixture, 'app-druva');
    expect(druva).toBeTruthy();
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
