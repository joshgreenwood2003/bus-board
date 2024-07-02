
import React, {useMemo, useState } from 'react';
import Stop from './classes/Stop';
import { LatLng } from 'leaflet';
import "leaflet/dist/leaflet.css";
import './index.css'
import MapBoxContainer from './components/MapBoxContainer';
import { getStops } from './functions/apiStopHandler';

function App(): React.ReactElement {
  const [map, setMap]: any = useState(null)
  const [postcode, setPostcode] = useState<string>("");
  const [tableData, setTableData] = useState<Stop[]>([]);


  const displayMap = useMemo(
    () => (
      <MapBoxContainer setMapRef={setMap} tableData={tableData} />
    ),
    [tableData],
  )

  const zoom = 16

  function DisplayPosition({ map,lat,long}: any) {
  if (lat && long){
  
    map.setView(new LatLng(lat,long), zoom,{
      animate: true,
    })
  }
    return (<></>)
  }

  async function formHandler(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault(); // to stop the form refreshing the page when it submits
    const [lat,long,data] = await getStops(postcode);

    DisplayPosition({map:map,lat:lat,long:long});
    setTableData(data);

  }
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



<div>
    {map ? <DisplayPosition map={map} /> : null}
      {displayMap}
    </div>
  </>;
}

export default App;