import express from 'express';
import hunter from './Peticiones/Hunters.js';

const app = express();

app.use('/hunters', hunter);
//app.use('/merchants', merchants);

app.listen(3000, () => {
    console.log('Server esperando en port 3000');
});