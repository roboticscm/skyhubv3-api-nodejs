import { findHandler, saveHandler } from './handler';
import { isAuthenticated } from '$/src/middleware/auth';

const app = require('express');
export const skylogRouter = app.Router();

skylogRouter.get('/', isAuthenticated, findHandler); 
skylogRouter.post('/', isAuthenticated, saveHandler); 

module.exports = skylogRouter;