import { saveOrUpdate } from '$/src/db/template';
import { isTextValueDuplicated,  isTextValueExisted } from '$/src/db/util';
import { existedError, nanError } from '$/src/errors/common';

export const saveOrUpdateHandler = async (req, res, next) => {
    const {id,  sort, orgId } = req.body;
    let {code, name } = req.body;

    if(code) {
        code = code.trim();
    }

    if(name) {
        name = name.trim();
    }

    if(id) {
        let isDuplicated = await isTextValueDuplicated('role', 'code', code, id);
        if(isDuplicated) {
            return existedError(res, 'code');
        }
        isDuplicated = await isTextValueDuplicated('role', 'name', name, id);
        if(isDuplicated) {
            return existedError(res, 'name');
        }
    } else {
        let isExisted = await isTextValueExisted('role', 'code', code);
        if(isExisted) {
            return existedError(res, 'code');
        }
        isExisted = await isTextValueExisted('role', 'name', name, id);
        if(isExisted) {
            return existedError(res, 'name');
        }
    }
    
    if (sort) {
        if (isNaN(sort)) {
            return nanError(res, 'sort');
        }
    }

    saveOrUpdate(req, res, 'role', id ? (builder) => builder.where({id}) : undefined
    , {code, name, sort, orgId}, {code, name, sort, orgId}).then((r) => {
        res.status(200).send(r);
    })
}
