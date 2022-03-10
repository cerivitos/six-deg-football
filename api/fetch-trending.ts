const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://sofifa.com/players?offset=';

const randomNumber = Math.floor(Math.random() * 40);

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AxiosError, AxiosResponse } from 'axios';

export default (req: VercelRequest, res: VercelResponse) => {
  axios
    .get(url + randomNumber)
    .then((response: AxiosResponse) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const table = $('tbody.list').children();

      const randomRow = table[Math.floor(Math.random() * table.length)];

      const url = $('.col-name > a', randomRow).attr('href');

      if (url) {
        res.status(200).send(url.toString().split('/')[2]);
        return;
      }

      res.status(200).send(188545);
    })
    .catch((error: AxiosError) => {
      console.warn(error);
      res.status(500).json({ error: error.message });
    });
};
