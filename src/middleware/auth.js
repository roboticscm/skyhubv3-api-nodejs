import { convertFieldsToCamelCase } from "$/src/lib/util"
import { select } from '$/src/db/template';
import { PUBLIC_KEY } from '$/src/index';
import jwt from 'jsonwebtoken';

const sha1 = require('js-sha1');

export const basicAuth = async (req, res, next) => {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
    const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':')

    const sql = `
        SELECT id, password FROM account
        WHERE disabled = FALSE AND username = ?
    `;
    select(req, res, sql, [username]).then((ret) => {
        let accounts;
        if(ret) {
            accounts = ret.map(r => convertFieldsToCamelCase(r))
        }
        if (accounts && accounts.length === 0) {
            res.status(400).send({
                message: `Username [${username}] is not found`,
                key: "ACCOUNT.MSG.USERNAME_NOT_FOUND_ERROR"
            });
        } else if (accounts && accounts.length > 1) {
            res.status(400).send({
                message: `There are ${accounts.length} users which have the same username`,
                key: "ACCOUNT.MSG.TOO_MANY_ACCOUNT_ERROR"
            })
        } else {
            const foundEncodedPassword = accounts[0].password
            const enterEncodedPassword = sha1(`${process.env.PRIVATE_KEY || 'Skyhub@010116'}${password}`)
        
            if (foundEncodedPassword === enterEncodedPassword) {
                req.body = {...req.body, username, userId: accounts[0].id, fullName: '...'} 
                next();
            } else {
                res.status(400).send({
                    message: `Password does not match`,
                    key: "ACCOUNT.MSG.WRONG_PASSWORD_ERROR"
                })
            }
        }
    }); 
}

export const isAuthenticated = async (req, res, next) => {
    const token = (req.headers.authorization || ' ').split(' ')[1];
    jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] }, (err, payload) => {
        if (err) {
            res.status(401).send({
                message: 'Invalid Token Error',
                key: 'SYS.MSG.INVALID_TOKEN_ERROR',
                statusCode: 401
            });
        } else {
            req.query.userId = payload.userId
            next();
        }
    });
}