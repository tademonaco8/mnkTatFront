import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { TurnosService } from './turnos.service';

describe('TurnosService', () => {
  let service: TurnosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TurnosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
