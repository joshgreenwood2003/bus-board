

export default class Bus{
    public destination:string;
    public line:string;
    public arrivalTime:Date;
    public ID:string
    public timeToStation:number

    public constructor(_destination:string,_line:string,_arrivalTime:string,_ID:string,_TTS:number){
        this.destination = _destination;
        this.line = _line;
        this.arrivalTime = new Date(_arrivalTime);
        this.ID = _ID;
        this.timeToStation = _TTS
    }
}