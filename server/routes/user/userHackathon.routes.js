// routes/admin.auth.routes.js
import express, { Router } from 'express';
const route = express.Router();

import authenticateToken from '../../middlewares/authenticateToken.js';
import {
  applyHackathon,
  deleteAllProjects,
  getAllProjects,
  getHackathons,
  getHackathonsId,
  getUserProjects,
  uploadProject,
  voteProject,
} from '../../controllers/user/user.controllers.js';
import { registerHackathon } from '../../controllers/user/registrationHackathon.js';

route.post('/projects', authenticateToken, uploadProject); // Specific project route
route.get('/projects', getAllProjects); // Specific project route
route.delete('/projects', authenticateToken, deleteAllProjects); // Specific project route

route.get('/projects/:userId', authenticateToken, getUserProjects); // Specific project route
route.post('/vote/:id', authenticateToken, voteProject); // Voting route

// Hackathon-related routes
route.get('/', authenticateToken, getHackathons);
route.get('/:id', authenticateToken, getHackathonsId);
route.post('/register', registerHackathon);

export default route;
