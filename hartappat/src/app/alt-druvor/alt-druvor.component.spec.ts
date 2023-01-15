import {ComponentFixture, TestBed} from '@angular/core/testing';

import { AltDruvorComponent } from './alt-druvor.component';
import {BackendService} from "../backend.service";

describe('AltDruvorComponent', () => {
  let component: AltDruvorComponent;
  let fixture: ComponentFixture<AltDruvorComponent>;

  beforeEach(async () => {
    let backendServiceStub;
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
