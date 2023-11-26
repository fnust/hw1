import NodeGeocoder from 'node-geocoder';

export async function getCoordinates(location, token) {
  const options = {
    provider: 'opencage',
    apiKey: token,
    formatter: null,
  };

  const geocoder = NodeGeocoder(options);
  const res = await geocoder.geocode(location);

  if (res.length == 0) {
    console.log('error, city not found or token is invalid.');
    return null;
  }

  return { latitude: res[0].latitude, longitude: res[0].longitude };
}
