import { TestBed } from '@angular/core/testing';

import { MovieOnlineService } from './movie-online.service';

describe('MovieOnlineService', () => {
  let service: MovieOnlineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieOnlineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
