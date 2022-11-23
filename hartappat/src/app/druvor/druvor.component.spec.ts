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
  let component: DruvorComponent;
  let fixture: ComponentFixture<DruvorComponent>;

  const backendServiceStub: Partial<BackendService> = {
    getGrapes(): Observable<Grape[]> {
      const r: Grape = {name:'Riesling', color:'grön'};
      const cs: Grape = {name:'Cabernet Saugvignon', color:'blå'};
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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have Riesling', () => {
    const r: Grape = {name: 'Riesling', color: 'grön'};
    expect(component.grapes).toContain(r);
  });

});
