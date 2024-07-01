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
        <b>Stop Names</b>
        <div>
          <ol>
            {prop.stop.buses.map((bus: Bus) => (
              <li key={bus.ID}>{bus.destination}</li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
};

export default BusStop;
