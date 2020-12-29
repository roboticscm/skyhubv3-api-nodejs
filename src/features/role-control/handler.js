import { select } from '$/src/db/template';

export const findHandler =  (req, res, next) => {
    const { menuPath, depId, userId } = req.query;
    
    if(!depId) {
        res.status(400).send ({
            message: 'Missing Department ID',
            key: 'SYS.MSG.MISSING_DEPARTMENT_ID',
        })
        return;
    }

    if(!menuPath) {
        res.status(400).send ({
            message: 'Missing Menu Path',
            key: 'SYS.MSG.MISSING_MENU_PATH',
        })
        return;
    }


    const sql = `SELECT * FROM find_roled_control(?, ?, ?) as json`;
    select(req, res, sql, [depId, menuPath, userId]).then((r) => {
        res.status(200).send(r[0].json);
    })
}

