import {TestBed} from '@angular/core/testing';

import {VinmonopoletService} from './vinmonopolet.service';
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {provideHttpClient} from "@angular/common/http";

describe('VinmonopoletService', () => {
  let service: VinmonopoletService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(VinmonopoletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
