import Cliente from "../Entidades/Cliente.js";

import { Router, Request, Response } from 'express';
const router = Router();

router.get('/', (_, res) => {
    res.send('Notes');
});

export default router;