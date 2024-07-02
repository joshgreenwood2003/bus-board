import Stop from "../classes/Stop";
import Bus from "../classes/Bus";
import { useEffect, useState } from "react";
import { createHash } from "crypto";
interface Props {
  stop: Stop;
}


const BusStop = (prop: Props) => {
  



  const [busData, setBusData] = useState<Bus[]>([]);






  async function initialiseBusesFromStop( ){
    const stopResult = await fetch(`https://api.tfl.gov.uk/StopPoint/${prop.stop.ID}/Arrivals`);
    const arrivalPredictions = await stopResult.json()
    ////////////////////////////////////////////////////////// CHECK FOR OK REQUEST
    let buses:Bus[] = arrivalPredictions.map((bus: any) => {
      return new Bus(bus.destinationName, bus.lineName, bus.expectedArrival, bus.id, bus.timeToStation)
  })
  buses.sort((a:Bus,b:Bus)=>{
    return a.timeToStation - b.timeToStation;
  })
    setBusData(buses)
}


// //initialiseBusesFromStop();

// let count = 0;
// setInterval(()=>{ 
//   count++;
//   if (count == 20){
    
//     count = 0;
//   }
//   else{
//     console.log("secondupdate")
//     // busData.forEach((bus:Bus)=>{
//     //   bus.timeToStation -= 1;
//     //   setBusData([...busData, bus])
//     // })
//   }
// },1000)

  useEffect(()=>{
    initialiseBusesFromStop();
  }, []);


  return (
    <>
      <h1>{prop.stop.name}</h1>
        <div>
            {busData.map((bus: Bus) => (
              <li key={bus.ID}><b>{bus.line}: </b>  {Math.floor(bus.timeToStation/60)}m {bus.timeToStation%60}s</li>
            ))}
        </div>
    </>
  );
};

export default BusStop;
