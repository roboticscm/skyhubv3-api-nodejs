import {getCurrentTime} from '$/src/lib/util';

const knexStringcase = require('knex-stringcase');

export const getKnexInstance = () => {
    return require('knex')( knexStringcase(require.main.require('../knexfile.js').production))
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