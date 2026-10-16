import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PacienteService } from '../../services/paciente.service';
import { Paciente } from '../../models/paciente';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css'
})
export class PacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  mensajeError = '';

  nuevo = {
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    historia_clinica: '',
  };

  constructor(private pacienteService: PacienteService) {}

  ngOnInit(): void {
    this.cargarPacientes();
  }

  cargarPacientes(): void {
    this.pacienteService.obtenerPacientes().subscribe(datos => {
      this.pacientes = datos;
    });
  }

  guardar(form: NgForm): void {
    const datos = {
      nombre: this.nuevo.nombre,
      apellido: this.nuevo.apellido,
      dni: this.nuevo.dni,
      telefono: this.nuevo.telefono || null,
      historia_clinica: this.nuevo.historia_clinica || null,
    };

    this.pacienteService.crearPaciente(datos).subscribe(() => {
      form.resetForm({ nombre: '', apellido: '', dni: '', telefono: '', historia_clinica: '' });
      this.cargarPacientes();
    });
  }
}