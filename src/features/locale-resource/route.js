import { findHandler, findInitialHandler } from './handler';
import { isAuthenticated } from '$/src/middleware/auth';

const app = require('express');
export const localeResourceRouter = app.Router();

localeResourceRouter.get('/', isAuthenticated, findHandler); 
localeResourceRouter.get('/get-initial/', findInitialHandler); 
