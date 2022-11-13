import { TestBed } from '@angular/core/testing';

import { VinmonopoletService } from './vinmonopolet.service';

describe('VinmonopoletService', () => {
  let service: VinmonopoletService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VinmonopoletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
