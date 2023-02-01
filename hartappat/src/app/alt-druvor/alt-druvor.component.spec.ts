import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AltDruvorComponent} from './alt-druvor.component';
import {BackendService, Grape} from "../services/backend.service";
import {Observable, of} from "rxjs";
import createSpyObj = jasmine.createSpyObj;

describe('AltDruvorComponent', () => {
  let component: AltDruvorComponent;
  let fixture: ComponentFixture<AltDruvorComponent>;
  const defaultGrapes = [
    {name: 'Rondo', color: 'blå'},
    {name: 'Solaris', color: 'grön'}];

  let backendServiceStub: BackendService;
  beforeEach(() => {

    backendServiceStub = createSpyObj<BackendService>(
      'BackendService',
      {
        addGrape: of(void 1),
        deleteGrape: of({name:'not deleted yet', color:'a color'}),
        getGrapes: of(defaultGrapes),
        getWines: undefined,
        patchGrape: undefined,
      })
  });

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
      expect(backendServiceStub.getGrapes).toHaveBeenCalled();
    });


  });

  it('should call backend deleteGrape when trying to delete', (done: DoneFn) => {
    const aGrape: Grape = {name: 'a name', color: 'a color'};
    component.deleteGrape(aGrape)
      .subscribe((grapes: Grape[]) => {
          expect(backendServiceStub.deleteGrape).toHaveBeenCalledWith(aGrape);
          expect(backendServiceStub.getGrapes).toHaveBeenCalledTimes(2); // In constructor, in delete method
          expect(grapes).toBe(defaultGrapes);
        });

    done();
  });

});
