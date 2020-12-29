import { localeResourceRouter } from '$/src/features/locale-resource/route';
import { authRouter } from '$/src/features/authentication/route';
import { departmentRouter } from '$/src/features/department/route';
import { userSettingsRouter } from '$/src/features/user-settings/route';
import { menuRouter } from '$/src/features/menu/route';
import { menuHistoryRouter } from '$/src/features/menu-history/route';
import { branchRouter } from '$/src/features/branch/route';
import { tableUtilRouter } from '$/src/features/table-util/route';
import { languageRouter } from '$/src/features/language/route';

const path = require('path');

export const registerRoute = (app) => {
    app.use('/locale-resource', localeResourceRouter); 
    log.info('registered: /locale-resource');

    app.use('/auth', authRouter);
    log.info('registered: /auth');

    app.use('/department', departmentRouter); 
    log.info('registered: /department');

    app.use('/user-settings', userSettingsRouter);
    log.info('registered: /user-settings');

    app.use('/menu', menuRouter);
    log.info('registered: /menu');

    app.use('/menu-history', menuHistoryRouter);
    log.info('registered: /menu-history');

    app.use('/branch', branchRouter);
    log.info('registered: /branch');

    app.get('/image', (req, res) => {
        const { id } = req.query;
        res.sendfile(path.join(__dirname, `../../public/images/${id}.jpg`));
    });
    log.info('registered: /image');

    app.use('/table-util', tableUtilRouter);
    log.info('registered: /table-util');

    app.use('/language', languageRouter);
    log.info('registered: /language');

    app.use('/search-util', require('$/src/features/search-util/route'));
    log.info('registered: /search-util');

    app.use('/role-control', require('$/src/features/role-control/route'));
    log.info('registered: /role-control');

    app.use('/role', require('$/src/features/role/route'));
    log.info('registered: /role');

    app.use('/menu-control', require('$/src/features/menu-control/route'));
    log.info('registered: /menu-control');
}
