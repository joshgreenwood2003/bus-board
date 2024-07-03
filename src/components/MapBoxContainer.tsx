import { MapContainer, MapContainerProps, Marker, Popup, TileLayer, useMap, useMapEvent } from 'react-leaflet'
import { Icon, LatLng, LatLngExpression, Map, marker } from 'leaflet';
import Stop from '../classes/Stop';
import BusStop from './BusStop';

interface Prop {
    setMapRef: React.SetStateAction<any>,
    tableData: Stop[],
    userPosition:GeolocationPosition | undefined

}

export const ZOOM_DEFAULT_DISTANCE = 16

const BUS_STOP_MAP_MARKER_IMAGE = "https://cdn-icons-png.flaticon.com/512/3448/3448339.png"
const LOCATION_MARKER_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Location_dot_blue.svg/640px-Location_dot_blue.svg.png"
const icon = new Icon({ iconUrl: BUS_STOP_MAP_MARKER_IMAGE, iconSize: [50, 50], iconAnchor: [25, 50], popupAnchor: [0, -1] })
const LocationIcon = new Icon({ iconUrl: LOCATION_MARKER_IMAGE, iconSize: [25, 25], iconAnchor: [12, 12]})
const MapBoxContainer = (props: Prop) => {

  return (
    <MapContainer className = "map-container" center={[51.505, 0]} ref = {props.setMapRef} zoom={ZOOM_DEFAULT_DISTANCE} zoomControl={false}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {props.tableData.map((stop:Stop)=>
      
      <Marker icon={icon}position={new LatLng(stop.latitude,stop.longitude)}>
        <Popup>
          <BusStop stop={stop} />
        </Popup>
      </Marker>
      
      )}
      {props.userPosition && <Marker icon = {LocationIcon}position = {new LatLng(props.userPosition.coords.latitude,props.userPosition.coords.longitude)}></Marker>}
   
  </MapContainer>
  )
}

export default MapBoxContainer