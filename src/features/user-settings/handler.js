import { select, selectObj } from '$/src/db/template';
import { getKnexInstance } from '$/src/db/util';

export const getInitialHandler = async (req, res, next) => {
    const { userId } = req.query;

    if (!userId) {
        res.status(400).send({
            message: 'Missing User ID',
            key: 'SYS.MSG.MISSING_USER_ID',
        })
        return;
    }

    const sql = `SELECT * FROM get_last_user_settings(?)`;
    select(req, res, sql, [userId]).then((settings) => res.status(200).send(settings))
}

export const saveUserSettingsHandler = async (req, res, next) => {
    const knex = getKnexInstance();

    const { branchId, menuPath, elementId, keys, values } = req.body;
    const { userId } = req.query;

    for (const [index, key] of keys.entries()) {
        const updatedRows = await knex('user_setting')
            .where((builder) => {
                builder.where('key', key);
                builder.andWhere('branchId', branchId ? branchId : null);
                builder.andWhere('accountId', userId ? userId : null);
                builder.andWhere('menuPath', menuPath ? menuPath : null);
                builder.andWhere('elementId', elementId ? elementId : null);
            }).update({ value: values[index] });
        if (!updatedRows) {
            await knex('user_setting').insert({
                branchId,
                accountId: userId,
                menuPath,
                elementId,
                key,
                value: values[index]
            });
        }
    }
    knex.destroy();
    res.status(200).send({
        message: "success"
    })
}

export const getUserSettingsHandler = (req, res, next) => {
    const { userId, menuPath, elementId, key, keys, branchId } = req.query;
    selectObj(res, 'user_setting', (builder) => {
        builder.where('accountId', userId);
        if (branchId) {
            builder.andWhere('branchId', branchId)
        }
        if (menuPath) {
            builder.andWhere('menuPath', menuPath)
        }
        if (elementId) {
            builder.andWhere('elementId', elementId)
        }
        if (key) {
            builder.andWhere('key', key)
        }
        if (keys) {
            builder.andWhere((b) => {
                b.whereIn('key', keys.split(','))
            })
        }
        return builder;
    }).then(settings => {
        res.status(200).send(settings);
    });
}