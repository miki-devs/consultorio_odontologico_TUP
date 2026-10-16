import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Paciente } from '../models/paciente';

@Injectable({ providedIn: 'root' })
export class PacienteService {
  private pacientes: Paciente[] = [
    { id: 1, nombre: 'Juan', apellido: 'Pérez', dni: '30123456', telefono: '3462-111111', historia_clinica: 'Alergia a la penicilina. Tratamiento de conducto previo en pieza 36.', fecha_registro: '2026-10-01T10:00' },
    { id: 2, nombre: 'María', apellido: 'Gómez', dni: '31234567', telefono: '3462-222222', historia_clinica: 'Paciente sin antecedentes médicos de relevancia. Viene por control.', fecha_registro: '2026-10-01T10:00' },
    { id: 3, nombre: 'Carlos', apellido: 'López', dni: '28345678', telefono: '3462-333333', historia_clinica: 'Diabético tipo 2 controlado. Necesita implante en pieza 14.', fecha_registro: '2026-10-01T10:00' },
  ];

  obtenerPacientes(): Observable<Paciente[]> {
    return of(this.pacientes);
  }

  obtenerPacientePorId(id: number): Observable<Paciente> {
    const paciente = this.pacientes.find(p => p.id === id);
    if (!paciente) {
      return throwError(() => new Error('Paciente no encontrado'));
    }
    return of(paciente);
  }

  crearPaciente(datos: Omit<Paciente, 'id' | 'fecha_registro'>): Observable<Paciente> {
    const nuevoId = Math.max(0, ...this.pacientes.map(p => p.id)) + 1;
    const nuevo: Paciente = {
      ...datos,
      id: nuevoId,
      fecha_registro: new Date().toISOString(),
    };
    this.pacientes.push(nuevo);
    return of(nuevo);
  }
}