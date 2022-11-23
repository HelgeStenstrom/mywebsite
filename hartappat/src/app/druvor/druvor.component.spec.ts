import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DruvorComponent } from './druvor.component';
import {BackendService, Grape} from "../backend.service";
import {Observable, of} from "rxjs";

describe('DruvorComponent', () => {
  let component: DruvorComponent;
  let fixture: ComponentFixture<DruvorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DruvorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DruvorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

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
      providers: [{provide: BackendService, useValue: backendServiceStub}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DruvorComponent);
    druvorComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(druvorComponent).toBeTruthy();
  });

  it('should have Riesling', () => {
    const r: Grape = {name: 'Riesling', color: 'grön'};
    expect(druvorComponent.grapes).toContain(r);
  });
  it('should have Cab', () => {
    expect(druvorComponent.grapes).toContain(cs);
  });

});
