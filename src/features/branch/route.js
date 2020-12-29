import { findHandler } from './handler';
import { isAuthenticated } from '$/src/middleware/auth';

const app = require('express');
export const branchRouter = app.Router();

branchRouter.get('/', isAuthenticated, findHandler); 