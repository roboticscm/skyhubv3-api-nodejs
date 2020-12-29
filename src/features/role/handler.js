import { saveOrUpdate } from '$/src/db/template';

export const saveOrUpdateHandler = (req, res, next) => {
    
    const {id, code, name, sort, orgId } = req.body;
    saveOrUpdate(req, res, 'role', id ? (builder) => builder.where({id}) : undefined
    , {code, name, sort, orgId}, {code, name, sort, orgId}).then((r) => {
        res.status(200).send(r);
    })
}
