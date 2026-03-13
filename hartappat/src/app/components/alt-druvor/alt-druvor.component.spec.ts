import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AltDruvorComponent} from './alt-druvor.component';
import {BackendService, Grape} from "../../services/backend/backend.service";
import {of} from "rxjs";

describe('AltDruvorComponent', () => {
  let component: AltDruvorComponent;
  let fixture: ComponentFixture<AltDruvorComponent>;
  const defaultGrapes = [
    {id: 1, name: 'Rondo', color: 'blå'},
    {id: 2, name: 'Solaris', color: 'grön'}];

  const backendServiceStub = {
    addGrape: jest.fn().mockReturnValue(of(void 1)),
    deleteGrape: jest.fn().mockReturnValue(of({id: 1, name:'not deleted yet', color:'a color'})),
    getGrapes: jest.fn().mockReturnValue(of(defaultGrapes)),
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
    expect(firstRow.textContent).toContain('Rondo');
    expect(firstRow.textContent).toContain('blå');
    expect(firstRow.textContent).toContain('Rondoblå');

    const secondRow = firstRow.nextElementSibling;
    expect(secondRow).toBeTruthy();
    expect(secondRow.textContent).toContain('Solaris');
  });

  describe('get grapes', () => {


    it('should call backend getGrapes', () => {
      expect(backendServiceStub.getGrapes).toHaveBeenCalled();
    });


  });

  it('should call backend deleteGrape when trying to delete', (done) => {
    const aGrape: Grape = {id: 1, name: 'a name', color: 'a color'};
    component.deleteGrape(aGrape)
      .subscribe((grapes: Grape[]) => {
          expect(backendServiceStub.deleteGrape).toHaveBeenCalledWith(aGrape);
          expect(backendServiceStub.getGrapes).toHaveBeenCalledTimes(2); // In constructor, in delete method
          expect(grapes).toBe(defaultGrapes);
        });

    done();
  });

});
