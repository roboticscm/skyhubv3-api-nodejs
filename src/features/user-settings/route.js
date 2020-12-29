import { getInitialHandler, saveUserSettingsHandler, getUserSettingsHandler } from './handler';
import { isAuthenticated } from '$/src/middleware/auth';

const app = require('express');
export const userSettingsRouter = app.Router();

userSettingsRouter.get('/initial', isAuthenticated, getInitialHandler); 
userSettingsRouter.post('', isAuthenticated, saveUserSettingsHandler); 
userSettingsRouter.get('', isAuthenticated, getUserSettingsHandler); 