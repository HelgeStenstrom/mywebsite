import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WikipediaComponent} from './wikipedia.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('WikipediaComponent', () => {
  let component: WikipediaComponent;
  let fixture: ComponentFixture<WikipediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ WikipediaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WikipediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
