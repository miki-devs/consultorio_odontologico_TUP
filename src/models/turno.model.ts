import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { pool } from '../config/db';

export interface Turno {
    id: number,
    paciente_id: number,
    fecha_hora: Date,
    motivo: string,
    estado: 'Pendiente' | 'Realizado' | 'Cancelado',
}

export type TurnoInput = Omit<Turno, 'id' | 'estado'>;
export type TurnoUpdateInput = Omit<Turno, 'id'>;

interface TurnoRow extends RowDataPacket, Turno {}

export const TurnoModel = {
    async findAll(): Promise<Turno[]> {
        const [ rows ] = await pool.query<TurnoRow[]>(
            'SELECT id, paciente_id, fecha_hora, motivo, estado FROM turnos'
        );
        return rows;
    },

    async findByID(id: number): Promise<Turno | null> {
        const [ rows ] = await pool.query<TurnoRow[]>(
            'SELECT id, paciente_id, fecha_hora, motivo, estado FROM turnos WHERE id = ?', [ id ]
        );
        return rows[ 0 ] ?? null;
    },

    async create(data: TurnoInput): Promise<Turno> {
        const [ result ] = await pool.query<ResultSetHeader>(
            'INSERT INTO turnos (paciente_id, fecha_hora, motivo) VALUES (?, ?, ?)', [data.paciente_id, data.fecha_hora, data.motivo]
        );
        return { id: result.insertId, ...data, estado: 'Pendiente'};
    },

    async update(id: number, data: TurnoUpdateInput): Promise<boolean> {
        const [ result ] = await pool.query<ResultSetHeader>(
            'UPDATE turnos SET paciente_id = ?, fecha_hora = ?, motivo = ?, estado = ? WHERE id = ?', [data.paciente_id, data.fecha_hora, data.motivo, data.estado, id]
        );
        return result.affectedRows > 0;
    },

    async changeStatus(id: number, newStatus: 'Pendiente' | 'Realizado' | 'Cancelado'): Promise<boolean> {
        const [ result ] = await pool.query<ResultSetHeader>(
            'UPDATE turnos SET estado = ? WHERE id = ?', [newStatus, id]
        );
        return result.affectedRows > 0;
    },

    async delete(id: number): Promise<boolean> {
        const [ result ] = await pool.query<ResultSetHeader>(
            'DELETE FROM turnos WHERE id = ?', [id]
        );
        return result.affectedRows > 0;
    }
}