import { TestBed } from '@angular/core/testing';

import { SensorHubService } from './sensor-hub.service';

describe('SensorHubService', () => {
  let service: SensorHubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SensorHubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
