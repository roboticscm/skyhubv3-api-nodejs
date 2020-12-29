import { selectObj } from '$/src/db/template';

export const findHandler = (req, res, next) => {
    selectObj(res, 'language', undefined, [{column: 'sort', order: 'asc'}]).then((r) => {
        res.status(200).send(r);
    })
    
}
