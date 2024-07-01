import Stop from "../classes/Stop";
import Bus from "../classes/Bus";

interface Props {
  stop: Stop;
}

const BusStop = (prop: Props) => {
  return (
    <>
      <h1>{prop.stop.name}</h1>
        <div>
            {prop.stop.buses.map((bus: Bus) => (
              <li key={bus.ID}><b>{bus.line}: </b>{bus.destination}   {bus.arrivalTime.toTimeString().split(' ')[0]}</li>
            ))}
        </div>
    </>
  );
};

export default BusStop;
