import { findHandler, saveOrDeleteHandler } from './handler';
import { isAuthenticated } from '$/src/middleware/auth';

const app = require('express');
export const menuControlRouter = app.Router();

menuControlRouter.get('/', isAuthenticated, findHandler); 
menuControlRouter.post('/', isAuthenticated, saveOrDeleteHandler); 

module.exports = menuControlRouter;