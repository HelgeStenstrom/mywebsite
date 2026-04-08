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
    getWinesByGrapeId: jest.fn().mockReturnValue(of([
      { id: 17, name: 'Vin ett' },
      { id: 42, name: 'Vin två' },
    ])),
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

  describe('Grape name and wine list', () => {

    test('The title displays the grape name', () => {
      const element = fixture.nativeElement.querySelector('[data-test="grape-title"]');
      expect(element.textContent).toContain('Test grape');
    })

    test('wine-count displays the number of wines', () => {
      const element = fixture.nativeElement.querySelector('[data-test="wine-count"]');
      expect(element.textContent).toContain('2');
    });

    test('wine list displays wine names', () => {
      const items = fixture.nativeElement.querySelectorAll('[data-test="wine-item"]');
      expect(items).toHaveLength(2);
      expect(items[0].textContent).toContain('Vin ett');
      expect(items[1].textContent).toContain('Vin två');
    });

    test('wine list items are links to the wine page', () => {
      const links = fixture.nativeElement.querySelectorAll('[data-test="wine-item"] a');
      expect(links).toHaveLength(2);
      expect(links[0].getAttribute('href')).toBe('/wines/17');
      expect(links[1].getAttribute('href')).toBe('/wines/42');
    });

  })

});
