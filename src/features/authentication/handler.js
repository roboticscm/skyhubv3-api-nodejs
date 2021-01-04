import { PRIVATE_KEY, PUBLIC_KEY } from '$/src/index';
import { getKnexInstance } from '$/src/db/util';
import { select, del } from '$/src/db/template';
import jwt from 'jsonwebtoken';

export const loginHandler = (req, res, next) => {
    const { username, userId, fullName } = req.body;

    const accessToken = generateToken(false, userId, username, fullName);
    const refreshToken = generateToken(true, userId, username, fullName);

    updateRefreshToken(userId, refreshToken);

    res.status(200).send({
        accessToken,
        refreshToken,
        userId,
        fullName
    });
}

const updateRefreshToken = async (userId, token) => {
    const knex = getKnexInstance();

    const updatedRows = await knex('refresh_token').where('accountId', '=', userId).update({ token });
    if (!updatedRows) {
        await knex('refresh_token').insert({ token, accountId: userId });
    }

    knex.destroy();
}

export const refreshTokenHandler = async (req, res, next) => {
    const refreshToken = req.body.token;
    if (!refreshToken) {
        res.status(400).send({
            messgage: 'Missing refresh token',
            key: 'AUTH.MSG.MISSING_TOKEN_ERROR'
        });
    }

    const sql = `
        SELECT id FROM refresh_token
	    WHERE token = ?
    `;

    let refreshTokens = await select(req, res, sql, [refreshToken]);

    if (!refreshTokens || refreshTokens.length === 0) {
        res.status(401).send({
            messgage: 'Required Login Error',
            key: '',
            statusCode: 401
        });
        return;
    }

    jwt.verify(refreshToken, PUBLIC_KEY, { algorithms: ['RS256'] }, (err, payload) => {
        if (err) {
            res.status(401).send({
                messgage: 'Required Login Error',
                key: '',
                statusCode: 401
            });
        } else {
            
            res.status(200).send({
                token: generateToken(false, payload.userId, payload.username, payload.fullName),
                success: true
            });
        }
    });
}


export const generateToken = (isRefreshToken, userId, username, fullName) => {
    const payload = {
        username,
        userId,
        fullName
    }
    const duration = 6000000; //second
    const exp = Math.floor(Date.now() / 1000) + duration;
    if (!isRefreshToken) {
        payload.exp = exp;
    }

    return jwt.sign(payload, PRIVATE_KEY, { algorithm: 'RS256' });
}


export const logoutHandler = (req, res, next) => {
    const { userId } = req.query;

    if(!userId) {
        res.status(400).send({
            message: 'Missing user id'
        });
    } else {
        del(req, res, 'refresh_token', (builder) => builder.where({accountId: userId})).then((deletedRows) => {
            if(!deletedRows) {
                res.status(400).send({
                    message: `User which Id: ${userId} does not existing`
                });
                return;
            } else {
                res.status(200).send({
                    message: 'Logout successful'
                });
                return;
            }
        })
        
    } 
}

export const changePasswordHandler = (req, res, next) => {
    console.log(req.body);
}
