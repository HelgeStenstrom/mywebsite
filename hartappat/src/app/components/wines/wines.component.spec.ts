import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WinesComponent} from './wines.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {WineComponent} from "../wine/wine.component";
import {FormsModule} from "@angular/forms";
import {By} from "@angular/platform-browser";
import {BackendService} from "../../services/backend.service";
import {of} from "rxjs";

describe('WinesComponent', () => {
  let component: WinesComponent;
  let fixture: ComponentFixture<WinesComponent>;

  let serviceMock: Partial<BackendService>;

  beforeEach(async () => {

    serviceMock = {
      // Define mocked methods or properties as needed
      getWines: jasmine.createSpy().and.returnValue(of([])),
      addWine: jasmine.createSpy(),
      //someProperty: 'mocked value'
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [ WinesComponent, WineComponent ],
      providers:[{provide: BackendService, useValue:serviceMock}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the wine from the WineComponent, when the button is clicked', () => {
    // Create a spy for the method
    spyOn(component.wineComponent, 'getWine');

    const buttonElement = fixture.debugElement.query(  By.css('[data-test="add-wine-button"]'));

    const querySelector = fixture.nativeElement.querySelector("button");
    expect(querySelector).toEqual(buttonElement.nativeElement);
    buttonElement.nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(component.wineComponent.getWine).toHaveBeenCalled();
  });

  it('should add a wine to the list, when the button is clicked', () => {
    // Create a spy for the method
    spyOn(component.wineComponent, 'getWine');

    const buttonElement = fixture.debugElement.query(  By.css('[data-test="add-wine-button"]'));
    buttonElement.nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(serviceMock.addWine).toHaveBeenCalled();
  });

  it('should  bring up a form when the edit button is clicked', () => {
    fail('This test is not implemented yet.');
  });

  it('should delete a wine from the list when the delete button is clicked', () => {
    fail('This test is not implemented yet.');
  });

});
