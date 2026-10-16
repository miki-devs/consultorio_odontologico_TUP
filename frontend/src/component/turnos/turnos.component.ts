import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TurnoService } from '../../services/turno.service';
import { PacienteService } from '../../services/paciente.service';
import { Turno } from '../../models/turno';
import { Paciente } from '../../models/paciente';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css'
})
export class TurnosComponent implements OnInit {
  turnos: Turno[] = [];
  pacientes: Paciente[] = [];
  mensajeError = '';
  idEditando: number | null = null;

  nuevo = {
    paciente_id: null as number | null,
    fecha_hora: '',
    motivo: '',
  };

  constructor(
    private turnoService: TurnoService,
    private pacienteService: PacienteService
  ) {}

  ngOnInit(): void {
    this.cargarTurnos();
    this.pacienteService.obtenerPacientes().subscribe(datos => {
      this.pacientes = datos;
    });
  }

  cargarTurnos(): void {
    this.turnoService.obtenerTurnos().subscribe(datos => {
      this.turnos = datos;
    });
  }

  editar(turno: Turno): void {
    this.idEditando = turno.id;
    this.nuevo = {
      paciente_id: turno.paciente_id,
      fecha_hora: turno.fecha_hora.slice(0, 16),
      motivo: turno.motivo,
    };
  }

  agendar(form: NgForm): void {
    if (this.nuevo.paciente_id === null) {
      return;
    }

    const datos = {
      paciente_id: this.nuevo.paciente_id,
      fecha_hora: this.nuevo.fecha_hora,
      motivo: this.nuevo.motivo,
    };

    if (this.idEditando !== null) {
      this.turnoService.actualizarTurno(this.idEditando, datos).subscribe(() => {
        this.terminar(form);
        this.cargarTurnos();
      });
    } else {
      this.turnoService.crearTurno(datos).subscribe(() => {
        this.terminar(form);
        this.cargarTurnos();
      });
    }
  }

  descartar(form: NgForm): void {
    this.terminar(form);
  }

  terminar(form: NgForm): void {
    this.idEditando = null;
    form.resetForm({ paciente_id: null, fecha_hora: '', motivo: '' });
  }
  cancelar(id: number): void {
    if (!confirm('¿Cancelar este turno?')) {
      return;
    }
    this.turnoService.cancelarTurno(id).subscribe(() => {
      this.cargarTurnos();
    });
  }
}