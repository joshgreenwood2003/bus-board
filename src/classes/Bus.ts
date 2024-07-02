

export default class Bus{
    public destination:string;
    public line:string;
    public arrivalTime:Date;
    public ID:string

    public constructor(_destination:string,_line:string,_arrivalTime:string,_ID:string){
        this.destination = _destination;
        this.line = _line;
        this.arrivalTime = new Date(_arrivalTime);
        this.ID = _ID;

    }
}