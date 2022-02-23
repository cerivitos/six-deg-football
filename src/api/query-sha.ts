import type { VercelRequest, VercelResponse } from '@vercel/node';
const dotenv = require('dotenv');

export default (req: VercelRequest, res: VercelResponse) => {
  dotenv.config();

  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    res.status(200).send(process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7));
  } else {
    res.status(404).send('Not found');
  }
};
