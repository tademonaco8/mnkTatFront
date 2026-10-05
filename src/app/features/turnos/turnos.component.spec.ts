import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TurnosComponent } from './turnos.component';

describe('TurnosComponent', () => {
  let component: TurnosComponent;
  let fixture: ComponentFixture<TurnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnosComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
