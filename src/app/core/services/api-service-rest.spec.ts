import { TestBed } from '@angular/core/testing';

import { ApiServiceRest } from './api-service-rest';

describe('ApiService', () => {
  let service: ApiServiceRest;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiServiceRest);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
