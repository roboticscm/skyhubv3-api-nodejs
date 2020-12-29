import { findSimpleListHandler, getOneHandler, softDeleteManyHandler, hasAnyDeletedRecordHandler, restoreOrForeverDeleteHandler, findDeletedRecordsHandler } from './handler';
import { isAuthenticated } from '$/src/middleware/auth';

const app = require('express');
export const tableUtilRouter = app.Router();

tableUtilRouter.get('/simple-list', isAuthenticated, findSimpleListHandler); 
tableUtilRouter.get('/has-any-deleted-record', isAuthenticated, hasAnyDeletedRecordHandler); 
tableUtilRouter.get('/find-deleted-records', isAuthenticated, findDeletedRecordsHandler); 
tableUtilRouter.put('/restore-or-forever-delete', isAuthenticated, restoreOrForeverDeleteHandler); 
tableUtilRouter.get('/:id', isAuthenticated, getOneHandler); 
tableUtilRouter.delete('/', isAuthenticated, softDeleteManyHandler); 