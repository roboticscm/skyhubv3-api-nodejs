import { errord400 } from '$/src/errors/common'

export const findHandler = async (req, res, next) => {
    const { menuPath } = req.query;

    if (!menuPath) {
        return errord400(res, 'SYS.MSG.MISSING_MENU_PATH');
    }

    /// TODO
    res.status(200).send({
        fields: ['field1', 'field2', 'field3']
    });
}

