import app from './server.ts';
import env from '../env.ts';

app.listen(env.PORT, () => {
  console.log(`Server is listening on port: ${env.PORT}`);
});
