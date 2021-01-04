import {getCurrentTime} from '$/src/lib/util';

const knexStringcase = require('knex-stringcase');

export const getKnexInstance = () => {
    return require('knex')( knexStringcase(require.main.require('../knexfile.js').production))
}

export const isTextValueDuplicated = async (tableName, columnName, value, id) => {
    return new Promise((resolve, reject) => {
        const knex = getKnexInstance();
        
        knex.raw('SELECT * FROM is_text_value_duplicated(?, ?, ?, ?) as "isDuplicated" ', [tableName, columnName, value, id]).then((res) => {
            resolve(res.rows[0].isDuplicated);
        }).catch((err) => reject(err))
        .finally(() => {
            knex.destroy();
        })
    })
}

export const isTextValueExisted = async (tableName, columnName, value) => {
    return new Promise((resolve, reject) => {
        const knex = getKnexInstance();
        
        knex.raw('SELECT * FROM is_text_value_existed(?, ?, ?) as "isExisted"', [tableName, columnName, value]).then((res) => {
            resolve(res.rows[0].isExisted);
        }).catch((err) => reject(err))
        .finally(() => {
            knex.destroy();
        })
    })
}

export const updateSystemFields = (userId) => {
    return {updatedAt: getCurrentTime(), updatedBy: userId}
}

export const createSystemFields = (userId) => {
    return {createdBy: userId}
}

export const deleteSystemFields = (userId) => {
    return {deletedAt: getCurrentTime(), deletedBy: userId}
}