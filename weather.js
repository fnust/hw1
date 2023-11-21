#!/usr/bin/env node

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { dateParser, printForecast } from './helpers/interpretation.js';
import { getCoordinates } from './helpers/location.js';
import { Command } from 'commander';

const program = new Command();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const file = path.join(__dirname, 'configs.json');

program
  .description(
    `Watch the weather in your city. For the first run, you need to set arguments -s -t. Then this data will be stored in memory and their input will not be required.`
  )
  .option(
    '-s, --city <string...>',
    'setting the city for which the information will be displayed.'
  )
  .option('-t, --token <string>', 'setting a token for the API (OpenCage).')
  .action(async (options) => {
    let location = null;
    let token = null;

    if (!options.city && !options.token) {
      try {
        const data = JSON.parse(fs.readFileSync(file));
        console.log('Request accepted!');
        location = data.location;
        token = data.token;
      } catch {
        console.error('Error, some parameters are required for the first run!');
        process.exit(1);
      }
    }

    if (options.city && options.token) {
      location = options.city.join(' ');
      token = options.token;

      const data = JSON.stringify({
        location: location,
        token: token,
      });
      fs.writeFile(file, data, 'utf8', (err) => {
        if (err) throw err;
        console.log('Request accepted!');
      });
    }

    if (!location | !token) {
      console.error('error, try again.');
      process.exit(1);
    }

    const coordinates = await getCoordinates(location, token);

    if (coordinates) {
      const url = `http://www.7timer.info/bin/api.pl?lon=${coordinates.longitude}&lat=${coordinates.latitude}&product=civil&output=json`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const initTimestamp = dateParser(data.init).getTime();
          printForecast(data.dataseries, initTimestamp, location);
        })
        .catch((error) => console.log(error));
    }
  });

program.parse();
