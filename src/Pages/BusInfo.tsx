import React, { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";
import "./../index.css";
import { Link, useParams } from "react-router-dom";
import { getStopFromID } from "../functions/apiStopFinder";
import Stop from "../classes/Stop";
import BusStop from "../components/BusStop";

export default function BusInfo(): React.ReactElement {
  let { BusID }: any = useParams();
  const [busData, setBusData] = useState<Stop>();

  async function initialise() {
    const stopData = await getStopFromID(BusID);
    const stop = new Stop(
      BusID,
      stopData.lat,
      stopData.lon,
      stopData.commonName,
      ""
    );
    setBusData(stop);
  }

  useEffect(() => {
    initialise();
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col w-full max-w-screen-2xl">
        <Link to="/">Back to Map</Link>
        <div className="flex">
          <div className="w-1/2">
            {busData && <BusStop stop={busData} />}
          </div>
          <div className="w-1/2">
            <p>More Details</p>
            <iframe
              src="https://www.google.com/maps/embed/v1/streetview?key=AIzaSyCZFK1YCh-8RQ4d3N3agKa4tFMby6eS_UQ&location=46.414382,10.013988&heading=210&pitch=10&fov=35"
              width="600"
              height="450"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
        </div>
    </div>
  );
}
