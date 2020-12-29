import { findHandler } from './handler';
import { isAuthenticated } from '$/src/middleware/auth';

const app = require('express');
export const roleControlRouter = app.Router();

roleControlRouter.get('/', isAuthenticated, findHandler); 

module.exports = roleControlRouter;