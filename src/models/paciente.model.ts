import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { pool } from '../config/db';

export interface Paciente {
    id: number,
    nombre: string,
    apellido: string,
    dni: string,
    telefono: string,
    historia_clinica: string,
    fecha_registro: Date,
}

export type PacienteInput = Omit<Paciente, 'id' | 'fecha_registro'>;

interface PacienteRow extends RowDataPacket, Paciente {}

export const PacienteModel = {
    async findAll(): Promise<Paciente[]> {
        const [ rows ] = await pool.query<PacienteRow[]>(
            'SELECT id, nombre, apellido, dni, telefono, historia_clinica, fecha_registro FROM pacientes'
        );
        return rows;
    },

    async findByID(id: number): Promise<Paciente | null> {
        const [ row ] = await pool.query<PacienteRow[]>(
            'SELECT id, nombre, apellido, dni, telefono, historia_clinica, fecha_registro FROM pacientes WHERE id = ?', [id]
        );
        return row[0] ?? null;
    },

    async create(data: PacienteInput): Promise<Paciente> {
        const [ result ] = await pool.query<ResultSetHeader>(
            'INSERT INTO pacientes (nombre, apellido, dni, telefono, historia_clinica VALUES (?, ?, ?, ?, ?)', [data.nombre, data.apellido, data.dni, data.telefono, data.historia_clinica]
        );
        return { id: result.insertId, ...data, fecha_registro: new Date() };
    },

    async update(id: number, data: PacienteInput): Promise<boolean> {
        const [ result ] = await pool.query<ResultSetHeader>(
            'UPDATE pacientes SET nombre = ?, apellido = ?, dni = ?, telefono = ?, historia_clinica = ?', [data.nombre, data.apellido, data.dni, data.telefono, data.historia_clinica]
        );
        return result.affectedRows > 0;
    },

    async delete(id: number): Promise<boolean> {
        const [ result ] = await pool.query<ResultSetHeader>(
            'DELETE FROM pacientes WHERE id = ?', [id]
        );
        return result.affectedRows > 0;
    },
};