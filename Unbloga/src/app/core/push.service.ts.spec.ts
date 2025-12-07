import { TestBed } from '@angular/core/testing';

import { PushServiceTs } from './push.service.ts';

describe('PushServiceTs', () => {
  let service: PushServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PushServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
