// routes/admin.auth.routes.js
import express, { Router } from 'express';
const route = express.Router();

import authenticateToken from '../../middlewares/authenticateToken.js';
import {
  applyHackathon,
  getAllProjects,
  getHackathons,
  getHackathonsId,
  getUserProjects,
  uploadProject,
  voteProject,
} from '../../controllers/user/user.controllers.js';

route.post('/projects', authenticateToken, uploadProject); // Specific project route
route.get('/projects', getAllProjects); // Specific project route
route.get('/projects/:userId', authenticateToken, getUserProjects); // Specific project route
route.post('/vote/:id', authenticateToken, voteProject); // Voting route

// Hackathon-related routes
route.get('/', authenticateToken, getHackathons);
route.get('/:id', authenticateToken, getHackathonsId);
route.post('/apply/:id', authenticateToken, applyHackathon);

export default route;
