import { findHandler } from './handler';
import { isAuthenticated } from '$/src/middleware/auth';

const app = require('express');
export const menuRouter = app.Router();

menuRouter.get('/', isAuthenticated, findHandler); 