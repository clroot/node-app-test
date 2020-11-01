import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import mongoose from 'mongoose';
import api from './api';

const { PORT } = process.env;

const router = new Router();
router.use('/api', api.routes());

const app = new Koa();
app.use(logger());
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

export const startServer = (port = PORT || 4000) => {
  mongoose
    .connect('mongodb://localhost:27017', {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB...'))
    .catch((error) => console.error(error));

  app.listen(port, () => {
    console.log(`Listening to port ${port}...`);
  });
};

export default app;
