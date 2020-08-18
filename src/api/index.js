const express= require('express');
const UserRouter = require('./resources/User/user.controller');
const passwordRouter = require('./resources/User/password-verification/password-verification');
//
const restRouter = express.Router();
/* 
Resources of API 
*/
restRouter.use('/user', UserRouter);
restRouter.use('/user/password', passwordRouter);


module.exports = restRouter;