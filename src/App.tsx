import { tab } from '@testing-library/user-event/dist/tab';
import React, { useEffect, useState } from 'react';
import Stop from './classes/Stop';
import Bus from './classes/Bus';
import BusStop from './components/BusStop';

const getLongLatFromPostcode = async (postcode: string): Promise<{ long: number, lat: number }> => {
  const url = new URL(`https://api.postcodes.io/postcodes/${postcode}`)
  const latLongRes = await fetch(url);
  if (!latLongRes.ok) {
    throw new Error("Request to api.postcodes.io was not successful!")
  }
  const latLongData = await latLongRes.json();
  const long = latLongData.result.longitude;
  const lat = latLongData.result.latitude;
  return { long, lat }
}

const getStopsFromLongLat = async (long: number, lat: number): Promise<any> => {
  // https://api-portal.tfl.gov.uk/api-details#api=StopPoint&operation=StopPoint_GetByGeoPointByQueryLatQueryLonQueryStopTypesQueryRadiusQueryUseSt
  const stopRes = await fetch("https://api.tfl.gov.uk/StopPoint/?lat=" + lat + "&lon=" + long + "&stopTypes=NaptanPublicBusCoachTram&radius=300");
  if (!stopRes.ok) {
    throw new Error("Request to api.tfl.gov.uk/StopPoint was not successful!")
  }
  const stopData = await stopRes.json()
  return stopData;
}


async function getStops(postcode: string): Promise<Stop[]> {


  //return [new Stop("ui",9,9,"d","wd",[])]
  const { long, lat } = await getLongLatFromPostcode(postcode);
  const stops = await getStopsFromLongLat(long, lat);

  let busStops: Stop[] = [];

  stops.stopPoints.forEach(async (item: any) => {

    const currentStop = item.naptanId
    const stopRes = await fetch(`https://api.tfl.gov.uk/StopPoint/${currentStop}/Arrivals`);
    const arrivalPredictions = await stopRes.json()
    let buses: Bus[] = [];
    arrivalPredictions.forEach((bus: any) => {
      buses.push(new Bus(bus.destinationName, bus.lineName, bus.expectedArrival, bus.id));
    });

    busStops.push(new Stop(item.naptanId, item.lat, item.lon, item.commonName, "", buses))

  })
  // TODO: add in stop code



  return busStops;
}



function App(): React.ReactElement {


  const [postcode, setPostcode] = useState<string>("");
  const [tableData, setTableData] = useState<Stop[]>([]);



  async function formHandler(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault(); // to stop the form refreshing the page when it submits
    const data = await getStops(postcode);
    setTableData(data);
  }

  function updatePostcode(data: React.ChangeEvent<HTMLInputElement>): void {
    setPostcode(data.target.value)
  }

  return <>
    <h1> BusBoard </h1>
    <form action="" onSubmit={formHandler}>
      <label htmlFor="postcodeInput"> Postcode: </label>
      <input type="text" id="postcodeInput" onChange={updatePostcode} />
      <input type="submit" value="Submit" />
    </form>

    {!!tableData[0]&&

      <div>
        <h1>Bus 1</h1>
        <BusStop stop={tableData[0]} />
      </div>
      }
    {!!tableData[1]&&
      <div>
        <h1>Bus 2</h1>
        <BusStop stop={tableData[1]} />
      </div>
    }

    <ol>

      {
        tableData.map((stop: Stop) =>
          <li key={stop.ID}>{stop.name}</li>
        )
      }
    </ol>

  </>;
}

export default App;