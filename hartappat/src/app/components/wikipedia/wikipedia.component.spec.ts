import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WikipediaComponent} from './wikipedia.component';
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {provideHttpClient} from "@angular/common/http";

describe('WikipediaComponent', () => {
  let component: WikipediaComponent;
  let fixture: ComponentFixture<WikipediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WikipediaComponent ],
      providers: [provideHttpClient(), provideHttpClientTesting()],
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
