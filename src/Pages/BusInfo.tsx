
import React, { useEffect, useState } from 'react';
import "leaflet/dist/leaflet.css";
import './../index.css'
import { useParams } from 'react-router-dom';
import { getStopFromID } from '../functions/apiStopFinder';
import Stop from '../classes/Stop';
import BusStop from '../components/BusStop';

export default function BusInfo(): React.ReactElement {


  let { BusID }: any = useParams();
  const [busData, setBusData] = useState<Stop>();

  async function initialise() {
    const stopData = await getStopFromID(BusID);
    const stop = new Stop(BusID, stopData.lat, stopData.lon, stopData.commonName, "")
    setBusData(stop)
  }


  useEffect(() => {
    initialise();
  }, []);


  return(
    <p>
      {busData &&
        <BusStop stop={busData} />
      }
    </p>);
}
