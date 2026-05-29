import { Router } from 'express';
import { getCars, getCarById } from '../controllers/cars.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getCars);
router.get('/:id', getCarById);

export default router;
