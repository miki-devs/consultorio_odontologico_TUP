import { Router } from "express";
import * as turnoController from "../controllers/turno.controller";

const router = Router();

router.get('/', turnoController.getAll);
router.get('/:id', turnoController.getById);
router.post('/', turnoController.create);
router.put('/', turnoController.update);
router.patch('/:id/estado', turnoController.changeStatus);
router.delete('/:id', turnoController.remove);

export default router;