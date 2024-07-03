export async function getStopFromID(ID: string): Promise<any> {
  const stopResult = await fetch("https://api.tfl.gov.uk/StopPoint/" + ID);

  try {
    if (!stopResult.ok) {
      throw new Error("Request to api.tfl.gov.uk/StopPoint was not successful!")
    }
    const stopData = await stopResult.json()
    return stopData;
  }
  catch (e) {
    console.error(e)
    return null;
  }

}
