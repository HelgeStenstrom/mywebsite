import { TestBed } from '@angular/core/testing';

import { SystembolagetService } from './systembolaget.service';

describe('SystembolagetService', () => {
  let service: SystembolagetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystembolagetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
