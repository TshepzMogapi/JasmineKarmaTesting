import { TestBed, inject } from '@angular/core/testing';

import { XLSXService } from './xlsx.service';

describe('XLSXService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [XLSXService]
    });
  });

  it('should be created', inject([XLSXService], (service: XLSXService) => {
    expect(service).toBeTruthy();
  }));
});
