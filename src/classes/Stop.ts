export default class Stop {
    public ID: string;
    public latitude: number;
    public longitude: number;
    public name: string;
    public stopLetter: string;

    public constructor(_ID: string, _lat: number, _long: number, _name: string, _stop: string) {
        this.ID = _ID;
        this.latitude = _lat;
        this.longitude = _long;
        this.name = _name;
        this.stopLetter = _stop;
    }
}


