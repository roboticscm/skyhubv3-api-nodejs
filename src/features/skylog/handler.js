import { select, save } from '$/src/db/template';



export const findHandler = async (req, res, next) => {
    const { menuPath, startDate, endDate } = req.query;
    let sql = `
        SELECT l.id, l.created_at as date, a.username as user, l.reason, l.description, l.short_description as "shortDescription", '' as view
        FROM sky_log l
        INNER JOIN account a ON a.id = l.created_by
        WHERE l.menu_path = ? 
    `;

    const param = [menuPath];

    if(startDate) {
        sql += ' AND l.created_at >= ? ';
        param.push(startDate);
    }

    if(endDate) {
        sql += ' AND l.created_at <= ? ';
        param.push(endDate);
    }

    sql += ' ORDER BY l.created_at DESC';
    select(req, res, sql, param).then((r) => {
        res.status(200).send(r);
    }) 
}


export const saveHandler = async (req, res, next) => {
    const { companyId, branchId, menuPath, ipClient, device, os, browser, shortDescription, description, reason} = req.body
    save(req, res, 'sky_log', {companyId, branchId, menuPath, ipClient, device, os, browser, shortDescription, description, reason}).then((r) => {
        res.status(200).send(r);
    });
}