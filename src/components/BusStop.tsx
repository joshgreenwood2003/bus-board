import Stop from "../classes/Stop";
import Bus from "../classes/Bus";
import { useEffect, useState } from "react";
import { createHash } from "crypto";
import { findBusesFromStopId } from "../functions/apiBusFinder";
import { Link } from "react-router-dom";
interface Props {
  stop: Stop;
}


const BusStop = (prop: Props) => {
  


  const [loading, setLoading] = useState<boolean>(true);
  const [busData, setBusData] = useState<Bus[]>([]);


async function initialiseBusesFromStop(){
  setBusData( await findBusesFromStopId(prop.stop.ID))
  setLoading(false)
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
    <div className="flex flex-col gap-5">
      <b className="text-lg">{prop.stop.name}</b>
        <div>
        {loading? <b>Loading...</b>:<>
          {(busData.length>0)?
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>ETA</th>
                </tr>
              </thead>
              <tbody>
              {busData.map((bus: Bus) => (
                <tr key={bus.ID}>
                  <td className="p-1.5">
                    <b className="font-bold max-w-fit px-3 py-1 rounded-md" style={{backgroundColor:`rgb(${bus.color[0]},${bus.color[1]},${bus.color[2]})`}}>
                      {bus.line}
                    </b>
                  </td>
                  <td>{Math.floor(bus.timeToStation/60)}m {bus.timeToStation%60}s</td>
                </tr>
              ))}
              </tbody>
            </table>
          :
            <b>No incoming busses</b>
          }
          </>
        }
        </div>
        { // only display when on home map
          window.location.pathname === "/" &&
          <Link  to={`/BusInfo/${prop.stop.ID}`} style={{color:"white"}}>View More Details</Link>
  }
    </div>
  );
};

export default BusStop;
