import express from 'express';
import router from './routes';
import './database';

const app = express();
app.use(router);

app.listen(3333, () => {
  // eslint-disable-next-line
  console.log('🏁 Server started!');
});
