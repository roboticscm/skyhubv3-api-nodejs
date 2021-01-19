import { saveHandler } from './handler';
import { isAuthenticated } from '$/src/middleware/auth';

const app = require('express');
export const menuHistoryRouter = app.Router();

menuHistoryRouter.post('', isAuthenticated, saveHandler); 