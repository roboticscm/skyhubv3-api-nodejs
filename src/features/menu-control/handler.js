import { del, select, saveOrUpdate, selectObj } from '$/src/db/template';

export const findHandler =  (req, res, next) => {
    const { menuPath } = req.query;
    
    if(!menuPath) {
        res.status(400).send ({
            message: 'Missing Menu Path',
            key: 'SYS.MSG.MISSING_MENU_PATH',
        })
        return;
    }

    
    const sql = `SELECT * FROM find_menu_control(?) as json`;
    select(req, res, sql, [menuPath]).then((r) => {
        res.status(200).send(r);
    })
}

export const saveOrDeleteHandler =  (req, res, next) => {
    const { menuPath, menuControls } = req.body;

    selectObj(res, 'menu', (builder) => builder.where({path: menuPath})).then((foundMenu) => {
        if(foundMenu.length > 0) {
            for(const row of menuControls) {
                if(row.checked) {
                    saveOrUpdate(req, res, 'menu_control', (builder) => builder.where({controlId: row.controlId, menuId: foundMenu[0].id}), {menuId: foundMenu[0].id}, {controlId: row.controlId, menuId: foundMenu[0].id});
                } else {
                    del(req, res, 'menu_control', (builder) => builder.where({controlId: row.controlId, menuId: foundMenu[0].id}));
                }
            }
        }
    });
}