import { select } from '$/src/db/template';

export const findHandler =  async (req, res, next) => {
    const { depId, userId } = req.query;

    if(!depId) {
        res.status(400).send ({
            message: 'Missing Department ID',
            key: 'SYS.MSG.MISSING_DEPARTMENT_ID',
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

    const sql = `SELECT * FROM find_menu(?, ?)`;
    select(req, res, sql, [userId, depId]).then((menu) => {
        res.status(200).send(menu);
    })
}

