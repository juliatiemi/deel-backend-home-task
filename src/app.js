import express, { json } from 'express';
import { sequelize } from './models';
import { adminRouter, contractRouter, jobRouter } from './routes';
import { balanceRouter } from './routes/balance-routes';

const app = express();
app.use(json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

init();

async function init() {
  try {
    app.listen(3001, () => {
      console.log('Express App Listening on Port 3001');
    });
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}

app.use('/admin', adminRouter);
app.use('/balances', balanceRouter);
app.use('/contracts', contractRouter);
app.use('/jobs', jobRouter);

export default app;
