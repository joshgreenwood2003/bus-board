import Bus from "../classes/Bus";


export async function findBusesFromStopId(ID:string ):Promise<Bus[]>{
    const stopResult = await fetch(`https://api.tfl.gov.uk/StopPoint/${ID}/Arrivals`);
    const arrivalPredictions = await stopResult.json()
    ////////////////////////////////////////////////////////// CHECK FOR OK REQUEST
    let buses:Bus[] = arrivalPredictions.map((bus: any) => {
      return new Bus(bus.destinationName, bus.lineName, bus.expectedArrival, bus.id, bus.timeToStation)
  })
  buses.sort((a:Bus,b:Bus)=>{
    return a.timeToStation - b.timeToStation;
  })
  return buses
    
}