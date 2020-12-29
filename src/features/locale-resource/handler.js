import { select } from '$/src/db/template';
import { convertFieldsToCamelCase } from '$/src/lib/util';

export const findHandler = (req, res, next) => {
    const { companyId } = req.query;
    const locale = req.query.locale || 'vi-VN';

    if (!companyId) {
        res.status(400).send({
            message: 'Missing Company ID',
            key: 'SYS.MSG.MISSING_COMPANY_ID'
        })
        return;
    }

    const sql = `
        SELECT * FROM find_language(?, ?)
    `;

    select (req, res, sql, [companyId, locale]).then((ret) => {
        res.status(200).send(ret.map(res => convertFieldsToCamelCase(res)));
    })
    
    
}


export const findInitialHandler = (req, res, next) => {
    const {locale} = req.query;
    const sql = `
        SELECT * FROM find_language(?, ?)
    `;
    select(req, res, sql, [null, locale]).then((ret) => {
        res.status(200).send(ret.map(r => convertFieldsToCamelCase(r)));
    })
    
}