import type { Request, Response } from 'express';
import { PacienteModel, type PacienteInput } from '../models/paciente.model';

type IdParams = { id: string };

function parseID(value: string): number | null {
    const ID = Number(value);
    return Number.isInteger(ID) && ID > 0 ? ID : null;
}

function isPacienteInput(body: any): body is PacienteInput {
    return (
        typeof body?.nombre === 'string' && body.nombre.trim() !== '' &&
        typeof body?.apellido === 'string' && body.apellido.trim() !== '' &&
        typeof body?.dni === 'string' && body.dni.trim() !== '' &&
        typeof body?.telefono === 'string' && body.telefono.trim() !== '' &&
        (body.telefono === undefined || typeof body.telefono === 'string') &&
        (body.historia_clinica === undefined || typeof body?.historia_clinica === 'string')
        && body.historia_clinica.trim() !== '' &&
        typeof body?.fecha_registro === 'string' && body.fecha_registro.trim() !== ''
    );
}

export const getAll = async (_req: Request, res: Response) => {
    res.json(await PacienteModel.findAll());
};

export const getById = async (req: Request<IdParams>, res: Response) => {
    const id = parseID(req.params.id);
    if (!id) {
        res.status(400).json({ error: 'ID inválido' });
        return;
    }

    const paciente = await PacienteModel.findByID(id);
    if (!paciente) {
        res.status(404).json({ error: 'Paciente no encontrado' });
        return;
    }

    res.json(paciente);
};

export const create = async (req: Request, res: Response) => {
    if (!isPacienteInput(req.body)) {
        res.status(400).json({ error: "Datos inválidos: nombre, precio y stock son obligatorios" });
        return;
    }

    const nuevo = await PacienteModel.create(req.body);
    res.status(201).json(nuevo);
};

export const update = async (req: Request<IdParams>, res: Response) => {
    const id = parseID(req.params.id);
    if (!id) {
        res.status(400).json({ error: "ID inválido" });
        return;
    }

    if (!isPacienteInput(req.body)) {
        res.status(400).json({ error: "Datos inválidos" });
        return;
    }

    const ok = await PacienteModel.update(id, req.body);
    if (!ok) {
        res.status(404).json({ error: "Paciente no encontrado" });
        return;
    }

    res.json({ id, ...req.body });
};

export const remove = async (req: Request<IdParams>, res: Response) => {
    const id = parseID(req.params.id);
    if (!id) {
        res.status(400).json({ error: "ID inválido" });
        return;
    }

    const ok = await PacienteModel.delete(id);
    if (!ok) {
        res.status(404).json({ error: "Paciente no encontrado" });
        return;
    }

    res.status(204).send();
}