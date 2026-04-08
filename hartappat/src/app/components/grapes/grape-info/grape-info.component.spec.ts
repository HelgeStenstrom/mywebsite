import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GrapeInfoComponent} from './grape-info.component';
import {GrapeService} from "../../../services/backend/grape.service";
import {Grape} from "../../../models/common.model";
import {of} from "rxjs";
import {provideRouter} from "@angular/router";

describe('GrapeInfoComponent', () => {
  let component: GrapeInfoComponent;
  let fixture: ComponentFixture<GrapeInfoComponent>;


  const mockedGrape: Grape = {
    id: 7,
    name: "Test grape",
    color: "",
    isUsed: false,
  }

  const grapeServiceMock = {
    getGrape: jest.fn().mockReturnValue(of(mockedGrape)),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrapeInfoComponent],
      providers: [
        provideRouter([]),
        {provide: GrapeService, useValue: grapeServiceMock},
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrapeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Grape name', () => {

    test('The title displays the grape name', () => {
      const element = fixture.nativeElement.querySelector('[data-test="grape-title"]');
      expect(element.textContent).toContain('Test grape');
    })

  })

});
