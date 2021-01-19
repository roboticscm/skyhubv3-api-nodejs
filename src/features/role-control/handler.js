import { select } from '$/src/db/template';
import { errord400 } from '$/src/errors/common'

export const findHandler =  async (req, res, next) => {
    const { menuPath, depId, userId } = req.query;
    
    if(!depId) {
        return errord400(res, 'SYS.MSG.MISSING_DEPARTMENT_ID');
    }

    if(!menuPath) {
        return errord400(res, 'SYS.MSG.MISSING_MENU_PATH');
    }

    const sql = `SELECT * FROM find_roled_control(?, ?, ?) as json`;
    select(req, res, sql, [depId, menuPath, userId]).then((r) => {
        res.status(200).send(r[0].json);
    })
}

