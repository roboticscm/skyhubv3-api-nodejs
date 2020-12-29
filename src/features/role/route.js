import { saveOrUpdateHandler } from './handler';
import { isAuthenticated } from '$/src/middleware/auth';

const app = require('express');
export const roleRouter = app.Router();

roleRouter.post('/', isAuthenticated, saveOrUpdateHandler); 

module.exports = roleRouter;