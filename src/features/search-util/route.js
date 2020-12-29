import { findHandler } from './handler';
import { isAuthenticated } from '$/src/middleware/auth';

const app = require('express');
export const searchUtilRouter = app.Router();

searchUtilRouter.get('/', isAuthenticated, findHandler); 

module.exports = searchUtilRouter;