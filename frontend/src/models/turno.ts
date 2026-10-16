export type EstadoTurno = 'Pendiente' | 'Realizado' | 'Cancelado'

export interface Turno {
  id: number;
  paciente_id: number;
  fecha_hora: string;
  motivo: string;
  estado: EstadoTurno;
  paciente_nombre?: string;
  paciente_apellido?: string;
}