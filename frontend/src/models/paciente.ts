export interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string | null;
  historia_clinica: string |null;
  fecha_registro: string | null;
}