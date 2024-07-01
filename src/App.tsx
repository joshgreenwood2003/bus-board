import { tab } from '@testing-library/user-event/dist/tab';
import React, {useState} from 'react';

const getLongLatFromPostcode = async (postcode : string) : Promise<{long:number, lat:number}> =>{
  const url = new URL(`https://api.postcodes.io/postcodes/${postcode}`)
  const latLongRes = await fetch(url);
  if(!latLongRes.ok)
  {
    throw new Error("Request to api.postcodes.io was not successful!")
  }
  const latLongData = await latLongRes.json();
  const long = latLongData.result.longitude;
  const lat = latLongData.result.latitude;
  return {long, lat}
}

const getStopsFromLongLat = async (long :number, lat:number) : Promise<any>=> {
  const stopRes = await fetch("https://api.tfl.gov.uk/StopPoint/?lat="+lat+"&lon="+long+"&stopTypes=NaptanPublicBusCoachTram&radius=300");
  if(!stopRes.ok)
  {
    throw new Error("Request to api.tfl.gov.uk/StopPoint was not successful!")
  }
  const stopData = await stopRes.json()
  return stopData;
}


async function getBuses(postcode: string): Promise<any[]> {
  
    const {long, lat} = await getLongLatFromPostcode(postcode);
    const stops = await getStopsFromLongLat(long, lat);
    
    let busStops:any[] = [];
    stops.stopPoints.forEach((item:any)=>{
      busStops.push(item);
    })

    return busStops;
}

function App(): React.ReactElement {
    const [postcode, setPostcode] = useState<string>("");
    const [tableData, setTableData] = useState<any[]>([]);

    async function formHandler(event: React.FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault(); // to stop the form refreshing the page when it submits
        const data = await getBuses(postcode);
        setTableData(data);
    }

    function updatePostcode(data: React.ChangeEvent<HTMLInputElement>): void {
        setPostcode(data.target.value)
    }

    return <>
        <h1> BusBoard </h1>
        <form action="" onSubmit={formHandler}>
            <label htmlFor="postcodeInput"> Postcode: </label>
            <input type="text" id="postcodeInput" onChange={updatePostcode}/>
            <input type="submit" value="Submit"/>
        </form>
        <ol>

        {
        tableData.map((stop:any)=>
           <li key={stop.naptanId}>{stop.commonName.toString()}</li>
        )
      }
        </ol>

    </>;
}

export default App;