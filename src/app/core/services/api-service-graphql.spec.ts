import { TestBed } from '@angular/core/testing';

import { ApiServiceGraphql } from './api-service-graphql';

describe('ApiServiceGraphql', () => {
  let service: ApiServiceGraphql;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiServiceGraphql);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
