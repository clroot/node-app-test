import Router from 'koa-router';
import * as apiCtrl from './api.ctrl';

const api = new Router();

api.post('/register', apiCtrl.register);
api.post('/login', apiCtrl.login);
api.post('/logout', apiCtrl.logout);
api.get('/check', apiCtrl.check);

export default api;
