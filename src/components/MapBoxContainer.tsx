import { MapContainer, MapContainerProps, Marker, Popup, TileLayer, useMap, useMapEvent } from 'react-leaflet'
import { Icon, LatLng, LatLngExpression, Map } from 'leaflet';
import Stop from '../classes/Stop';
import BusStop from './BusStop';

interface Prop {
    setMapRef: React.SetStateAction<any>,
    tableData: Stop[]

}

export const ZOOM_DEFAULT_DISTANCE = 16

const BUS_STOP_MAP_MARKER_IMAGE = "https://cdn-icons-png.flaticon.com/512/3448/3448339.png"
const icon = new Icon({ iconUrl: BUS_STOP_MAP_MARKER_IMAGE, iconSize: [35, 35], iconAnchor: [18, 35], popupAnchor: [0, -1] })
  
const MapBoxContainer = (props: Prop) => {

  return (
    <MapContainer className = "map-container" center={[51.505, 0]} ref = {props.setMapRef} zoom={ZOOM_DEFAULT_DISTANCE}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {props.tableData.map((stop:Stop)=>
      
      <Marker icon={icon}position={new LatLng(stop.latitude,stop.longitude)}>
        <Popup>
          <BusStop stop={stop} />
        </Popup>
      </Marker>
      
      )}
   
  </MapContainer>
  )
}

export default MapBoxContainer