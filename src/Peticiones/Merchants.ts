import Mercader from '../Entidades/Mercader.js';

import { Router, Request, Response } from 'express';
const router = Router();

router.get('/', (_, res) => {
    res.send('Notes');
});

export default router;