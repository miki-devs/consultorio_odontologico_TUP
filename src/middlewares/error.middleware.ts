import type { Request, Response, NextFunction } from 'express';
export function notFound(req: Request, res: Response) {
    res.status(404).json({
        error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    });
}
// Tiene que tener los 4 parámetros para que Express
// lo reconozca como handler de errores
export function errorHandler(
    err: unknown, _req: Request, res: Response, _next: NextFunction
) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
}