import { loginHandler, refreshTokenHandler, logoutHandler } from './handler';
import { basicAuth } from '$/src/middleware/auth';


const app = require('express');
export const authRouter = app.Router();

authRouter.post('/login', basicAuth, loginHandler); 
authRouter.post('/refresh-token', refreshTokenHandler); 
authRouter.delete('/logout', logoutHandler); 