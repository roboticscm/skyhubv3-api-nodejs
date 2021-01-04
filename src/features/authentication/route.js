import { loginHandler, refreshTokenHandler, logoutHandler, changePasswordHandler } from './handler';
import { basicAuth } from '$/src/middleware/auth';
import { isAuthenticated } from '$/src/middleware/auth';

const app = require('express');
export const authRouter = app.Router();

authRouter.post('/login', basicAuth, loginHandler); 
authRouter.put('/change-pw', isAuthenticated, changePasswordHandler); 
authRouter.post('/refresh-token', refreshTokenHandler); 
authRouter.delete('/logout', logoutHandler); 