import { getKnexInstance } from '$/src/db/util';
import { getCurrentTime } from '$/src/lib/util';
import { saveOrUpdate } from '$/src/db/template';

export const saveMenuHistoryHandler = (req, res, next) => {
    const knex = getKnexInstance();

    const { menuId, depId } = req.body;
    const { userId } = req.query;
    const lastAccess = getCurrentTime();
    saveOrUpdate (req, res, 'menu_history',
        (builder) => builder.where({menuId}, {accountId: userId}, {depId}),
        {lastAccess},
        {
            menuId,
            accountId: userId,
            depId,
            lastAccess
        }
    ).then((ret) => res.status(200).send(ret)); 
}

