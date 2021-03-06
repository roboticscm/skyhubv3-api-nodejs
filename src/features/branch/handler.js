import { select } from '$/src/db/template';

export const findHandler = async (req, res, next) => {
    const {userId, fromOrgType, toOrgType, includeDisabled, includeDeleted } = req.query;
    const sql = `SELECT * FROM find_branch_tree(?, ?, ?, ?, ?) as "json"`;
    select(req, res, sql, [userId, fromOrgType, toOrgType, includeDeleted, includeDisabled]).then((branches) => {
        res.status(200).send(branches[0].json);
    });
}