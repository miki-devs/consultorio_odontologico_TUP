import type { Request, Response } from 'express';
import { TurnoModel, type TurnoInput, type TurnoUpdateInput } from '../models/turno.model';

type IdParams = { id: string };

function parseID(value: string): number | null {
    const ID = Number(value);
    return Number.isInteger(ID) && ID > 0 ? ID : null;
}

// Validador para la creación (no requiere 'estado' porque el modelo le asigna 'Pendiente' por defecto)
function isTurnoInput(body: any): body is TurnoInput {
    return (
        typeof body?.paciente_id === 'number' && body.paciente_id > 0 &&
        typeof body?.fecha_hora === 'string' && body.fecha_hora.trim() !== '' &&
        typeof body?.motivo === 'string' && body.motivo.trim() !== ''
    );
}

// Validador para la actualización completa (requiere 'estado')
function isTurnoUpdateInput(body: any): body is TurnoUpdateInput {
    return (
        typeof body?.estado === 'string' &&
        ['Pendiente', 'Realizado', 'Cancelado'].includes(body.estado) &&
        isTurnoInput(body) // Se evalúa al final para no sobrescribir el tipo antes de tiempo
    );
}

export const getAll = async (_req: Request, res: Response) => {
    res.json(await TurnoModel.findAll());
};

export const getById = async (req: Request<IdParams>, res: Response) => {
    const id = parseID(req.params.id);
    if (!id) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }

    const turno = await TurnoModel.findByID(id);
    if (!turno) {
        res.status(404).json({ error: 'Turno no encontrado' });
        return;
    }

    res.json(turno);
};

export const create = async (req: Request, res: Response) => {
    if (!isTurnoInput(req.body)) {
        res.status(400).json({ error: "Datos inválidos: paciente_id, fecha_hora y motivo son obligatorios" });
        return;
    }

    const nuevo = await TurnoModel.create(req.body);
    res.status(201).json(nuevo);
};

export const update = async (req: Request<IdParams>, res: Response) => {
    const id = parseID(req.params.id);
    if (!id) {
        res.status(400).json({ error: "ID inválido" });
        return;
    }

    if (!isTurnoUpdateInput(req.body)) {
        res.status(400).json({ error: "Datos inválidos: verifique los campos, incluyendo el estado válido" });
        return;
    }

    const ok = await TurnoModel.update(id, req.body);
    if (!ok) {
        res.status(404).json({ error: "Turno no encontrado" });
        return;
    }

    res.json({ id, ...req.body });
};

// Método adicional para usar `changeStatus` del modelo (ideal para un endpoint PATCH /turnos/:id/estado)
export const changeStatus = async (req: Request<IdParams>, res: Response) => {
    const id = parseID(req.params.id);
    if (!id) {
        res.status(400).json({ error: "ID inválido" });
        return;
    }

    const { estado } = req.body;
    if (!['Pendiente', 'Realizado', 'Cancelado'].includes(estado)) {
        res.status(400).json({ error: "Estado inválido. Debe ser 'Pendiente', 'Realizado' o 'Cancelado'" });
        return;
    }

    const ok = await TurnoModel.changeStatus(id, estado);
    if (!ok) {
        res.status(404).json({ error: "Turno no encontrado" });
        return;
    }

    res.json({ id, estado, message: "Estado actualizado correctamente" });
};

export const remove = async (req: Request<IdParams>, res: Response) => {
    const id = parseID(req.params.id);
    if (!id) {
        res.status(400).json({ error: "ID inválido" });
        return;
    }

    const ok = await TurnoModel.delete(id);
    if (!ok) {
        res.status(404).json({ error: "Turno no encontrado" });
        return;
    }

    res.status(204).send();
};