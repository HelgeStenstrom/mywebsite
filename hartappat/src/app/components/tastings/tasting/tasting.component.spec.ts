import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TastingComponent} from './tasting.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {WineTasting} from "../../../services/backend/backend.service";
import {RouterTestingModule} from "@angular/router/testing";

describe('TastingComponent', () => {
  let component: TastingComponent;
  let fixture: ComponentFixture<TastingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TastingComponent],
      imports: [HttpClientTestingModule, RouterTestingModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TastingComponent);
    component = fixture.componentInstance;
    component.tasting = { id: 1 } as WineTasting;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
