import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import * as Sentry from '@sentry/node'; // Correct import statement
import connectDB from './DB/db.js';
import adminAuthRoutes from './routes/admin/adminAuth.routes.js';
import userAuthRoutes from './routes/user/userAuth.routes.js';
import './instrument.js'; // Setup Sentry for error handling
import adminHackathon from './routes/admin/adminHackathon.routes.js';
import userHackathon from './routes/user/userHackathon.routes.js';
import cors from 'cors';
import { handleChatbotRequest } from './controllers/chatbotController.js';

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());
app.use(cookieParser());
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/user/auth', userAuthRoutes);
app.use('/api/admin/hackathon', adminHackathon);
app.use('/api/user/hackathon', userHackathon);

app.post('/chat', handleChatbotRequest);

connectDB();

const port = process.env.PORT || 8000;
Sentry.setupExpressErrorHandler(app);

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
