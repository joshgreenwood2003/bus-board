import Bus from "../classes/Bus";
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
  
  const getStopsFromLongLat = async (long: number, lat: number): Promise<any> => {
    // Documentation:
    // https://api-portal.tfl.gov.uk/api-details#api=StopPoint&operation=StopPoint_GetByGeoPointByQueryLatQueryLonQueryStopTypesQueryRadiusQueryUseSt
    const stopResult = await fetch("https://api.tfl.gov.uk/StopPoint/?lat=" + lat + "&lon=" + long + "&stopTypes=NaptanPublicBusCoachTram&radius=300");
    if (!stopResult.ok) {
      throw new Error("Request to api.tfl.gov.uk/StopPoint was not successful!")
    }
    const stopData = await stopResult.json()
    return stopData;
  }
  
  const getBusesFromStop = async (stopID: string): Promise<Bus[]> => {
    const stopResult = await fetch(`https://api.tfl.gov.uk/StopPoint/${stopID}/Arrivals`);
    const arrivalPredictions = await stopResult.json()
    let buses: Bus[] = [];
    buses = arrivalPredictions.map((bus: any) => {
      return new Bus(bus.destinationName, bus.lineName, bus.expectedArrival, bus.id)
    })
  
    return buses
  }
  
  
  
  export async function getStops(postcode: string): Promise<[number,number,Stop[]]> {
  
    const { long, lat } = await getLongLatFromPostcode(postcode);
    const stops = await getStopsFromLongLat(long, lat);
    let busStops: Stop[] = [];
  
    busStops = await Promise.all(stops.stopPoints.map(async (item: any) => {
      return new Stop(item.naptanId, item.lat, item.lon, item.commonName, "", await getBusesFromStop(item.naptanId))
    }
    ))
  
    // TODO: add in stop code
    return [lat,long,busStops];
  }