import {TestBed} from '@angular/core/testing';

import {VinmonopoletService} from './vinmonopolet.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('VinmonopoletService', () => {
  let service: VinmonopoletService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(VinmonopoletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
