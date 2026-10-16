import { Injectable } from '@angular/core';
import { Observable, of, throwError, map } from 'rxjs';
import { Turno } from '../models/turno';
import { PacienteService } from './paciente.service';

@Injectable({ providedIn: 'root' })
export class TurnoService {
  private turnos: Turno[] = [
    { id: 1, paciente_id: 1, fecha_hora: '2026-10-06T09:00', motivo: 'Control de tratamiento de conducto', estado: 'Pendiente', paciente_nombre: 'Juan', paciente_apellido: 'Pérez' },
    { id: 2, paciente_id: 2, fecha_hora: '2026-10-06T09:45', motivo: 'Limpieza anual', estado: 'Pendiente', paciente_nombre: 'María', paciente_apellido: 'Gómez' },
    { id: 3, paciente_id: 3, fecha_hora: '2026-10-06T10:30', motivo: 'Evaluación inicial para implante', estado: 'Pendiente', paciente_nombre: 'Carlos', paciente_apellido: 'López' },
    { id: 4, paciente_id: 1, fecha_hora: '2026-09-20T10:00', motivo: 'Tratamiento de conducto - Sesión 1', estado: 'Realizado', paciente_nombre: 'Juan', paciente_apellido: 'Pérez' },
  ];

  constructor(private pacienteService: PacienteService) {}

  obtenerTurnos(): Observable<Turno[]> {
  const ordenados = [...this.turnos].sort((a, b) => a.fecha_hora.localeCompare(b.fecha_hora));
  return of(ordenados);
  }

  crearTurno(datos: Omit<Turno, 'id' | 'estado'>): Observable<Turno> {
    return this.pacienteService.obtenerPacientePorId(datos.paciente_id).pipe(
      map(paciente => {
        const nuevoId = Math.max(0, ...this.turnos.map(t => t.id)) + 1;
        const nuevo: Turno = {
          ...datos,
          id: nuevoId,
          estado: 'Pendiente',
          paciente_nombre: paciente.nombre,
          paciente_apellido: paciente.apellido,
        };
        this.turnos.push(nuevo);
        return nuevo;
      })
    );
  }

  actualizarTurno(id: number, datos: Omit<Turno, 'id' | 'estado'>): Observable<Turno> {
    const indice = this.turnos.findIndex(t => t.id === id);
    if (indice === -1) {
      return throwError(() => new Error('Turno no encontrado'));
    }
    return this.pacienteService.obtenerPacientePorId(datos.paciente_id).pipe(
      map(paciente => {
        this.turnos[indice] = {
          ...this.turnos[indice],
          ...datos,
          paciente_nombre: paciente.nombre,
          paciente_apellido: paciente.apellido,
        };
        return this.turnos[indice];
      })
    );
  }

  cancelarTurno(id: number): Observable<Turno> {
    const turno = this.turnos.find(t => t.id === id);
    if (!turno) {
      return throwError(() => new Error('Turno no encontrado'));
    }
    turno.estado = 'Cancelado';
    return of(turno);
  }
}