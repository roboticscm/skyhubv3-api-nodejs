import { findHandler } from './handler';
import { isAuthenticated } from '$/src/middleware/auth';

const app = require('express');
export const languageRouter = app.Router();

languageRouter.get('/', isAuthenticated, findHandler); 