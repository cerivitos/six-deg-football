const axios = require('axios');

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AxiosError, AxiosResponse } from 'axios';

export default (req: VercelRequest, res: VercelResponse) => {
  if (req.query.url == undefined) {
    res.status(500).json({ error: 'No image URL provided' });
    return;
  }

  const imgUrl = decodeURIComponent(req.query.url as string);

  axios
    .get(imgUrl, { responseType: 'arraybuffer' })
    .then((response: AxiosResponse) => {
      const base64 = Buffer.from(response.data, 'binary').toString('base64');
      res.status(200).json({ base64: base64 });
    })
    .catch((error: AxiosError) => {
      console.warn(error);
      res.status(500).json({ error: error.message });
    });
};
