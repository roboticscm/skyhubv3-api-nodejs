import { select } from '$/src/db/template';

export const findHandler = (req, res, next) => {
    const { branchId, userId } = req.query;

    if(!branchId) {
        res.status(400).send ({
            message: 'Missing branch ID',
            key: 'SYS.MSG.MISSING_BRANCH_ID',
        })
        return;
    }


    if(!userId) {
        res.status(400).send ({
            message: 'Missing User ID',
            key: 'SYS.MSG.MISSING_USER_ID',
        })
        return;
    }

    const sql = `SELECT * FROM find_department(?, ?)`;
    select(req, res, sql, [branchId, userId]).then((departments) => {
        res.status(200).send(departments);
    })    
}

export const getLastHandler = (req, res, next) => {
    const { branchId, userId } = req.query;

    if(!branchId) {
        res.status(400).send ({
            message: 'Missing branch ID',
            key: 'SYS.MSG.MISSING_BRANCH_ID',
        })
        return;
    }


    if(!userId) {
        res.status(400).send ({
            message: 'Missing User ID',
            key: 'SYS.MSG.MISSING_USER_ID',
        })
        return;
    }
    const sql = `SELECT * FROM get_last_department_id(?, ?) as "depId"`;
    select(req, res, sql, [branchId, userId]).then((r) => {
        res.status(200).send(r);
    })    
}