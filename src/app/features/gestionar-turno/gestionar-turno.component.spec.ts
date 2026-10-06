import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { GestionarTurnoComponent } from './gestionar-turno.component';

describe('GestionarTurnoComponent', () => {
  let component: GestionarTurnoComponent;
  let fixture: ComponentFixture<GestionarTurnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarTurnoComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(GestionarTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
