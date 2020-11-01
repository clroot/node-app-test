import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import api from './api';

const { PORT } = process.env;

const router = new Router();
router.use('/api', api.routes());

const app = new Koa();
app.use(logger());
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

export const startServer = (port = PORT || 4000) => {
  app.listen(port, () => {
    console.log(`Listening to port ${port}...`);
  });
};

export default app;
