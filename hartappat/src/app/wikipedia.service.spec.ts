import {TestBed} from '@angular/core/testing';

import {WikipediaService} from './wikipedia.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('WikipediaService', () => {
  let service: WikipediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(WikipediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
