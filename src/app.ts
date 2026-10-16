import express from "express";
import pacienteRoutes from "./routes/paciente.routes";
import turnoRoutes from "./routes/turno.routes";

import { notFound, errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(express.json());

app.get("health", (_req, res) => {
    res.json({ status: "ok" });
})

app.use('/api/pacientes', pacienteRoutes);
app.use('/api/turnos', turnoRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;