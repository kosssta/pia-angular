import { TestBed } from '@angular/core/testing';

import { RasadniciService } from './rasadnici.service';

describe('RasadniciService', () => {
  let service: RasadniciService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RasadniciService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
