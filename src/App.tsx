
import { MapContainer, MapContainerProps, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import React, { useCallback, useEffect, useState } from 'react';
import Stop from './classes/Stop';
import Bus from './classes/Bus';
import BusStop from './components/BusStop';
import { Icon, LatLng, LatLngExpression, Map} from 'leaflet';


// import 'leaflet/dist/leaflet.css';
// import 'leaflet/dist/leaflet.js';
import "leaflet/dist/leaflet.css";
import './index.css'

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




const getBusesFromStop = async (stopID:string):Promise<Bus[]>=>{
  const stopRes = await fetch(`https://api.tfl.gov.uk/StopPoint/${stopID}/Arrivals`);
  const arrivalPredictions = await stopRes.json()
  let buses: Bus[] = [];
  buses = arrivalPredictions.map((bus:any)=>{
    return new Bus(bus.destinationName, bus.lineName, bus.expectedArrival, bus.id)
  })

  return buses
}



async function getStops(postcode: string): Promise<Stop[]> {

  const { long, lat } = await getLongLatFromPostcode(postcode);
  const stops = await getStopsFromLongLat(long, lat);
  let busStops: Stop[] = [];

  busStops = await Promise.all(stops.stopPoints.map(async (item: any) => {
   return new Stop(item.naptanId, item.lat, item.lon, item.commonName, "", await getBusesFromStop(item.naptanId))}
  ))

  // TODO: add in stop code



  return busStops;
}














function App(): React.ReactElement {


 // const [map, setMap] = useState<React.ForwardRefExoticComponent<MapContainerProps & React.RefAttributes<LeafletMap>>>(null);
 // map.setView(center, zoom)

const icon = new Icon({iconUrl:"https://cdn-icons-png.flaticon.com/512/3448/3448339.png",iconSize:[35,35],iconAnchor:[18,35],popupAnchor:[18,35]})
  const [postcode, setPostcode] = useState<string>("");
  const [tableData, setTableData] = useState<Stop[]>([]);



  async function formHandler(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault(); // to stop the form refreshing the page when it submits
    const data = await getStops(postcode);
    setTableData(data);
  }
  const position:LatLngExpression = [51.505, -0.09]
  function updatePostcode(data: React.ChangeEvent<HTMLInputElement>): void {
    setPostcode(data.target.value)
  }

  return <>
    <div className='lg:grid lg:grid-cols-3 my-7 mx-16 flex flex-col gap-5'>
      <div className='text-4xl font-bold p-5 backdrop-blur-md w-fit rounded-md'>
        <h1> 🏙️🚌Bus-Board </h1>
      </div>
      <div>
        <form action="" onSubmit={formHandler} className='flex w-full'>
          <input type="text" id="postcodeInput" placeholder='Enter your postcode...' className='p-3 grow' onChange={updatePostcode} />
          <input type="submit" value="Search" className='bg-slate-800 text-white p-3 hover:bg-slate-600' />
        </form>
      </div>
    </div>
{/* 
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
    </ol> */}



<div>
<MapContainer center={[51.505, 0]} zoom={14} className='map-container'>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {tableData.map((stop:Stop)=>
      
      <Marker icon={icon}position={new LatLng(stop.latitude,stop.longitude)}>
      <Popup>
      <BusStop stop={stop} />
      </Popup>
    </Marker>
      
      )}
     


    </MapContainer>
    

</div>
       




    </>;
}

export default App;