import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WikipediaComponent} from './wikipedia.component';
import {WikipediaService} from "../../services/wikipedia.service";
import {of} from "rxjs";

describe('WikipediaComponent', () => {
  let component: WikipediaComponent;
  let fixture: ComponentFixture<WikipediaComponent>;

  const wikipediaServiceMock = {
    getAnnounce: jest.fn().mockReturnValue(of({})),
    getPage: jest.fn().mockReturnValue(of({})),
    getFeatured: jest.fn().mockReturnValue(of({tfa: {displaytitle: ''}})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ WikipediaComponent ],
      providers: [
        {provide: WikipediaService, useValue: wikipediaServiceMock},
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(WikipediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
