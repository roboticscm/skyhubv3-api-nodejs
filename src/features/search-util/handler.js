import { select } from '$/src/db/template';

export const findHandler =  (req, res, next) => {
    const { menuPath } = req.query;

    if(!menuPath) {
        res.status(400).send ({
            message: 'Missing Menu Path',
            key: 'SYS.MSG.MISSING_MENU_PATH',
        })
        return;
    }

    res.status(200).send({
        fields: ['field1', 'field2', 'field3']
    });
}

