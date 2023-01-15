import {ComponentFixture, TestBed} from '@angular/core/testing';

import { AltDruvorComponent } from './alt-druvor.component';
import {BackendService, Grape} from "../backend.service";
import {Observable, of} from "rxjs";

describe('AltDruvorComponent', () => {
  let component: AltDruvorComponent;
  let fixture: ComponentFixture<AltDruvorComponent>;

  // let backendServiceStub;
  const backendServiceStub: Partial<BackendService> = {
    getGrapes(): Observable<Grape[]> {
      return of([
        {name: 'Rondo', color: 'blå'},
        {name: 'Solaris', color: 'grön'}]);
    }
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [ AltDruvorComponent ],
      providers: [{provide: BackendService, useValue: backendServiceStub}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltDruvorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should have list of grapes', () => {
    // See https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector
    const listing = fixture.nativeElement.querySelector('#grapes-listing');
    expect(listing).toBeTruthy();
  });

  it('should have two grapes', () => {
    const listing = fixture.nativeElement.querySelector('#grapes-listing');

    const firstRow = listing.querySelector('tr');
    expect(firstRow).toBeTruthy();
    expect(firstRow.innerText).toContain('Rondo\tblå');

    const secondRow = firstRow.nextElementSibling;
    expect(secondRow).toBeTruthy();
    expect(secondRow.innerText).toContain('Solaris');
  });

  describe('get grapes', () => {

    it('should call backend getGrapes', () => {
      expect(1 + 1).toBe(2);
    });
  });

});
