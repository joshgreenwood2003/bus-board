
import React, { useEffect, useMemo, useState } from 'react';
import MapBoxContainer, { ZOOM_DEFAULT_DISTANCE } from './../components/MapBoxContainer';
import { getStopsFromPostcode } from './../functions/apiStopHandler';
import { LatLng } from 'leaflet';
import Stop from './../classes/Stop';
import "leaflet/dist/leaflet.css";
import './../index.css'

export default function Home(): React.ReactElement {
  const [map, setMap]: any = useState(null)
  const [postcode, setPostcode] = useState<string>("");
  const [tableData, setTableData] = useState<Stop[]>([]);
  const [userLocation, setUserLocation] = useState<GeolocationPosition>();


  const displayMap = useMemo(
    () => (
      <MapBoxContainer setMapRef={setMap} tableData={tableData} userPosition={userLocation} />
    ), [tableData, userLocation])

  function MoveMapToPoint({ map, lat, long }: { map: any, lat: number | undefined, long: number | undefined }) {
    if (lat && long) {
      map.setView(new LatLng(lat, long), ZOOM_DEFAULT_DISTANCE, {
        animate: true,
      })
    }
    return (<></>)
  }

  async function formHandler(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault(); // to stop the form refreshing the page when it submits
    const [lat, long, data] = await getStopsFromPostcode(postcode);
    if(data.length > 0){
      MoveMapToPoint({ map: map, lat: lat, long: long });
      setTableData(data);
    }

  }
  function updatePostcode(data: React.ChangeEvent<HTMLInputElement>): void {
    setPostcode(data.target.value)
  }




  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // Success function
        setUserLocation,
        // Error function
        null,
        // Options. See MDN for details.
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
    }
  }, [])

  return (<>
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
    <div>
      {map ? <MoveMapToPoint map={map} long={undefined} lat={undefined} /> : null}
      {displayMap}
    </div>
  </>);
}
