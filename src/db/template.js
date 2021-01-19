import { getKnexInstance, createSystemFields, updateSystemFields, deleteSystemFields } from '$/src/db/util';
import { error400 } from '$/src/errors/common';

export const select = async (req, res, sql, params) => {
    return new Promise((resolve, reject) => {
        const knex = getKnexInstance();
        
        knex.raw(sql, params).then((res) => {
            resolve(res.rows);
        }).catch((err) => error400(res, err))
        .finally(() => {
            knex.destroy();
        })
    })
}

export const selectObj = async (res, tableName, whereBuilder, orderBy) => {
    const knex = getKnexInstance();

    return new Promise((resolve, reject) => {
        const k = knex(tableName);
        if(orderBy) {
            k.orderBy(orderBy);
        }
        if(whereBuilder) {
            k.where((builder) => {
                if(whereBuilder) {
                    whereBuilder(builder);
                }
                
            });
        }

        k.then((ret) => {
            resolve(ret);
        })
        .catch((err) => error400(res, err))
        .finally(() => {
            knex.destroy();
        })
    })
}

export const softDelete = async (req, res, tableName, whereBuilder) => {
    const { userId } = req.query;
    return new Promise((resolve, reject) => {
        const knex = getKnexInstance();
        
        knex(tableName).where((builder) => whereBuilder(builder)).update({ 
            ...deleteSystemFields(userId)
        }).then((res) => {
            resolve(res);
        }).catch((err) => error400(res, err))
        .finally(() => {
            knex.destroy();
        })
    })
}

export const del = async (req, res, tableName, whereBuilder) => {
    return new Promise((resolve, reject) => {
        const knex = getKnexInstance();
        knex(tableName).where((builder) => whereBuilder(builder)).del().then((res) => {
            resolve(res);
        }).catch((err) => error400(res, err))
        .finally(() => {
            knex.destroy();
        })
    })
}

export const saveOrUpdate = async (req, res, tableName, updateWhereCallback, updatePayload, insertPayload) => {
    const { userId } = req.query;
    const knex = getKnexInstance();

    return new Promise((resolve, reject) => {
        const k= knex(tableName);
        if(updateWhereCallback) {
            k.where((builder) => {
                updateWhereCallback(builder);
            }).update({ ...updatePayload, ...updateSystemFields(userId) })
            .then((updatedRows) => {
                if (!updatedRows) {
                    knex(tableName).returning('*').insert({
                        ...insertPayload,
                        ...createSystemFields(userId)
                    }).then((ret) => {
                        resolve(ret[0]);
                    }).catch((err) => error400(res, err));
                } else {
                    resolve({
                        message: `Updated: ${updatedRows}`
                    });
                }

            })
            .catch((err) => error400(res, err))
            .finally(() => {
                knex.destroy();
            })
        } else {
            knex(tableName).returning('*').insert({
                ...insertPayload,
                ...createSystemFields(userId)
            }).then((ret) => {
                resolve(ret[0]);
            }).catch((err) => error400(res, err))
            .finally(() => {
                knex.destroy();
            })
        }
        
    })
}

export const save = async (req, res, tableName, insertPayload) => {
    const { userId } = req.query;
    const knex = getKnexInstance();

    return new Promise((resolve, reject) => {
        knex(tableName).returning('*').insert({
            ...insertPayload,
            ...createSystemFields(userId)
        }).then((ret) => {
            resolve(ret[0]);
        }).catch((err) => error400(res, err))
        .finally(() => {
            knex.destroy();
        })
        
    })
}


export const update = async (req, res, tableName, updateWhereCallback, updatePayload) => {
    const { userId } = req.query;
    const knex = getKnexInstance();

    return new Promise((resolve, reject) => {
        knex(tableName).where((builder) => {
            updateWhereCallback(builder);
        }).update({ ...updatePayload, ...updateSystemFields(userId) })
        .then((ret) => {
            resolve({
                message: ret
            });
        }).catch ((err) => {
            error400(res, err);
        }).finally (() => {
            knex.destroy();
        });
        
    });
}