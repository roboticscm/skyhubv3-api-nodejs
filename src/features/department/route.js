import { findHandler, getLastHandler } from './handler';
import { isAuthenticated } from '$/src/middleware/auth';

const app = require('express');
export const departmentRouter = app.Router();

departmentRouter.get('/', isAuthenticated, findHandler); 
departmentRouter.get('/last', isAuthenticated, getLastHandler); 