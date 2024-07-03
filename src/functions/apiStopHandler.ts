import Stop from "../classes/Stop";

const getLongLatFromPostcode = async (postcode: string): Promise<{ long: number, lat: number }> => {
  const url = new URL(`https://api.postcodes.io/postcodes/${postcode}`)
  const latLongResult = await fetch(url);
  if (!latLongResult.ok) {
    throw new Error("Request to api.postcodes.io was not successful!")
  }
  const latLongData = await latLongResult.json();
  const long = latLongData.result.longitude;
  const lat = latLongData.result.latitude;
  return { long, lat }
}




// Documentation:
// https://api-portal.tfl.gov.uk/api-details#api=StopPoint&operation=StopPoint_GetByGeoPointByQueryLatQueryLonQueryStopTypesQueryRadiusQueryUseSt
const getStopsFromLongLat = async (long: number, lat: number): Promise<any> => {
  let searchRadius: number = 1000;
  const stopResult = await fetch("https://api.tfl.gov.uk/StopPoint/?lat=" + lat + "&lon=" + long + `&stopTypes=NaptanPublicBusCoachTram&radius=${searchRadius.toString()}`);
  if (!stopResult.ok) {
    throw new Error("Request to api.tfl.gov.uk/StopPoint was not successful!")
  }
  const stopData = await stopResult.json()
  return stopData;
}






export async function getStopsFromPostcode(postcode: string): Promise<[number, number, Stop[]]> {
  try {
    const { long, lat } = await getLongLatFromPostcode(postcode);
    const stops = await getStopsFromLongLat(long, lat);
    let busStops: Stop[] = [];
    busStops = await Promise.all(stops.stopPoints.map(async (item: any) => {
      return new Stop(item.naptanId, item.lat, item.lon, item.commonName, "");
    }
    ))
    // TODO: add in stop code
    return [lat, long, busStops];
  }
  catch (e) {
    console.error(e);
    return [0, 0, []]
  }

}