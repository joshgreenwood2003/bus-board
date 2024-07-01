import Bus from "./Bus";

export default class Stop{
    public ID: string;
    public latitude: Number;
    public longitude: Number;
    public name:string;
    public stopLetter:string;
    public buses:Bus[];

    public constructor(_ID:string,_lat:Number,_long:Number,_name:string,_stop:string,_buses:Bus[]){
        this.ID = _ID;
        this.latitude = _lat;
        this.longitude = _long;
        this.name = _name;
        this.stopLetter = _stop;
        this.buses = _buses;
    }
}