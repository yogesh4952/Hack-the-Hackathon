// routes/admin.auth.routes.js
import express from 'express';
const route = express.Router();

import authenticateToken from '../../middlewares/authenticateToken.js';
import { createHackathon } from '../../controllers/admin/admin.hackathon.js';

route.post('/', authenticateToken, createHackathon);

export default route;
