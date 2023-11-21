export function dateParser(str) {
  return new Date(
    str.slice(0, 4),
    str.slice(4, 6) - 1,
    str.slice(6, 8),
    str.slice(8)
  );
}

export function printForecast(data, initTimestamp, location) {
  const currentTimestamp = new Date().getTime();

  //finding the current timepoint
  let timestep =
    Math.floor((currentTimestamp - initTimestamp) / (3 * 60 * 60 * 1000)) - 1;
  if (timestep >= 56) {
    console.log('error');
    return;
  }

  console.log(`Daily weather forecast in ${location}.\n`);

  for (let i = 0; i < 8; ++i) {
    console.log(
      `*****  ${new Date(
        initTimestamp + data[timestep + i].timepoint * 60 * 60 * 1000
      ).toLocaleString()}  *****`
    );

    printCloudCover(data[timestep + i].cloudcover);
    console.log(`Temperature: ${data[timestep + i].temp2m}℃`);
    console.log(`Relative Humidity: ${data[timestep + i].rh2m}`);
    printWind(data[timestep + i].wind10m);
    printPrecipitation(data[timestep + i].weather);

    console.log('\n');
  }
}

function printCloudCover(value) {
  const data = {
    1: '0%-6%',
    2: '6%-19%',
    3: '19%-31%',
    4: '31%-44%',
    5: '44%-56%',
    6: '56%-69%',
    7: '69%-81%',
    8: '81%-94%',
    9: '94%-100%',
  };
  console.log(`Cloud Cover: ${data[value]}`);
}

function printWind(value) {
  const speed = {
    1: 'below 0.3m/s (calm)',
    2: '0.3-3.4m/s (light)',
    3: '3.4-8.0m/s (moderate)',
    4: '8.0-10.8m/s (fresh)',
    5: '10.8-17.2m/s (strong)',
    6: '17.2-24.5m/s (gale)',
    7: '24.5-32.6m/s (storm)',
    8: 'over 32.6m/s (hurricane)',
  };

  const direction = {
    N: 'North',
    NE: 'Northeast',
    E: 'East',
    SE: 'Southeast',
    S: 'South',
    SW: 'Southwest',
    W: 'West',
    NW: 'Northwest',
  };

  console.log(
    `${direction[value.direction]} wind with a speed of ${speed[value.speed]}.`
  );
}

function printPrecipitation(value) {
  if (value.includes('clear')) {
    console.log('Precipitation is not expected.');
    return;
  }

  if (value.includes('rain')) {
    console.log('Rain is possible.');
    return;
  }

  if (value.includes('snow')) {
    console.log('Snow is possible.');
  }
}
