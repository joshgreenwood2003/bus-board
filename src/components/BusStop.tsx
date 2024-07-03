import Stop from "../classes/Stop";
import Bus from "../classes/Bus";
import { useEffect, useState } from "react";
import { findBusesFromStopId } from "../functions/apiBusFinder";
import { Link } from "react-router-dom";
interface Props {
  stop: Stop;
}


const BusStop = (prop: Props) => {

  const [loading, setLoading] = useState<boolean>(true);
  const [busData, setBusData] = useState<Bus[]>([]);


  async function initialiseBusesFromStop() {
    setBusData(await findBusesFromStopId(prop.stop.ID))
    setLoading(false)
  }

  useEffect(() => {
    initialiseBusesFromStop();
     // eslint-disable-next-line
  }, []);

  // TODO: Perform a suitable refresh of bus data

  return (
    <div className="flex flex-col gap-5">
      <b className="text-lg">{prop.stop.name}</b>
      <div>
        {loading ? <b>Loading...</b> : <>
          {(busData.length > 0) ?
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
                      <b className="font-bold max-w-fit px-3 py-1 rounded-md" style={{ backgroundColor: `rgb(${bus.color[0]},${bus.color[1]},${bus.color[2]})` }}>
                        {bus.line}
                      </b>
                    </td>
                    <td>{Math.floor(bus.timeToStation / 60)}m {bus.timeToStation % 60}s</td>
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
        <Link className="w-full p-3 bg-slate-600 text-white hover:bg-orange-500 text-center" to={`/BusInfo/${prop.stop.ID}`} style={{ color: "white" }}>View More Details</Link>
      }
    </div>
  );
};

export default BusStop;
