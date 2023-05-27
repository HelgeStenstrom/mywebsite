import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WinesComponent} from './wines.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {WineComponent} from "../wine/wine.component";
import {FormsModule} from "@angular/forms";

describe('WinesComponent', () => {
  let component: WinesComponent;
  let fixture: ComponentFixture<WinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [ WinesComponent, WineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a wine to the list, when the butt on is clicked', () => {
    fail('This test is not implemented yet.');
  });

  it('should  bring up a form when the edit button is clicked', () => {
    fail('This test is not implemented yet.');
  });

  it('should delete a wine from the list when the delete button is clicked', () => {
    fail('This test is not implemented yet.');
  });

});
