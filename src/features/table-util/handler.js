import { select, softDelete } from '$/src/db/template';
import { errord400 } from '$/src/errors/common';

export const findSimpleListHandler = async (req, res, next) => {
    const { tableName, columns, orderBy, page, pageSize, onlyMe, userId,  includeDisabled } = req.query;

    if(!tableName) {
        return errord400(res, "SYS.MSG.MISSING_TABLE_NAME");
    }

    if(!columns) {
        return errord400(res, "SYS.MSG.MISSING_COLUMN_LIST");
    }

    if(!orderBy) {
        return errord400(res, "SYS.MSG.MISSING_ORDER_BY_COLUMN");
    }

    if(!page) {
        return errord400(res, "SYS.MSG.MISSING_PAGE");
    }

    if(!pageSize) {
        return errord400(res, "SYS.MSG.MISSING_PAGE_SIZE");
    }

    if(!onlyMe) {
        return errord400(res, "SYS.MSG.MISSING_ONLY_ME");
    }

    if(!userId) {
        return errord400(res, "SYS.MSG.MISSING_USER_ID");
    }

    if(!includeDisabled) {
        return errord400(res, "SYS.MSG.MISSING_INCLUDE_DISABLED");
    }

    const sql = `SELECT * FROM find_simple_list(?, ?, ?, ?, ?, ?, ?, ?) as json`;
    select(req, res, sql, [tableName, columns, orderBy, page, pageSize, onlyMe, userId,  includeDisabled]).then((data) => {
        res.status(200).send(data[0].json);
    })    
}


export const getOneHandler = async (req, res, next) => {
    const { tableName} = req.query;
    const { id } = req.params;

    if(!tableName) {
        return errord400(res, "SYS.MSG.MISSING_TABLE_NAME");
    }

    if(!id) {
        return errord400(res, "SYS.MSG.MISSING_ID");
    }

    const sql = `SELECT * FROM get_one_by_id(?, ?) as json`;
    select(req, res, sql, [tableName, id]).then((data) => {
        res.status(200).send(data[0].json);
    })    
}

export const hasAnyDeletedRecordHandler = async (req, res, next) => {
    const { tableName, userId} = req.query;
    let { onlyMe } = req.query;

    if(!tableName) {
        return errord400(res, "SYS.MSG.MISSING_TABLE_NAME");
    }

    if(!onlyMe) {
        onlyMe = false;
    }

    const sql = `SELECT * FROM has_any_deleted_record(?, ?, ?) as json`;
    select(req, res, sql, [tableName, onlyMe, userId]).then((data) => {
        res.status(200).send(data[0].json);
    })    
}

export const restoreOrForeverDeleteHandler = async (req, res, next) => {
    const { tableName, userId, companyId, branchId, menuPath, ipClient, device, os, browser, fieldName} = req.query;
    let { deleteIds, restoreIds, reason} = req.query;
    
    if(!tableName) {
        return errord400(res, "SYS.MSG.MISSING_TABLE_NAME");
    }

    if(!deleteIds) {
        deleteIds = null;
    }

    if(!restoreIds) {
        restoreIds = null;
    }

    if(!reason) {
        reason = null;
    }

    if(companyId) {
        const sql = `SELECT * FROM restore_or_forever_delete(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) as json`;
        select(req, res, sql, [tableName, deleteIds, restoreIds, userId, companyId, branchId, menuPath, ipClient, device, os, browser, reason, fieldName]).then((data) => {
            res.status(200).send(data[0].json);
        })   
    } else {
        const sql = `SELECT * FROM restore_or_forever_delete(?, ?, ?, ?) as json`;
        select(req, res, sql, [tableName, deleteIds, restoreIds, userId]).then((data) => {
            res.status(200).send(data[0].json);
        })   
    }
     
}

export const findDeletedRecordsHandler = async (req, res, next) => {
    const { tableName, columns, userId} = req.query;
    let { onlyMe } = req.query;

    if(!tableName) {
        return errord400(res, "SYS.MSG.MISSING_TABLE_NAME");
    }

    if(!columns) {
        return errord400(res, "SYS.MSG.MISSING_COLUMN_LIST");
    }

    if(!onlyMe) {
        onlyMe = false;
    }

    const sql = `SELECT * FROM find_deleted_records(?, ?, ?, ?) as json`;
    select(req, res, sql, [tableName, columns, onlyMe, userId]).then((data) => {
        res.status(200).send(data[0].json);
    })    
}


export const softDeleteManyHandler = async (req, res, next) => {
    const { tableName, userId, ids} = req.query;
    
    if(!tableName) {
        return errord400(res, "SYS.MSG.MISSING_TABLE_NAME");
    }

    if(!ids) {
        return errord400(res, "SYS.MSG.MISSING_IDS");
    }

    softDelete(req, res, tableName, (builder) => {
        builder.whereIn('id', ids.split(','))
    }).then((r) => {
        res.status(200).send({deletedRows: r});
    });
}
