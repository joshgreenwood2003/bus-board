const seedrandom = require('seedrandom')

function getRgbFromInputString(inputString:string) : [number,number,number]{
    // Generate a unique number from input string
    let seed:number = 0
    let weight = 10;
    for(let i = 0; i < inputString.length; i++){
        seed += inputString.charCodeAt(i)*weight
        weight+=10
    }

    const random = new seedrandom(seed);

    // Weighted more towards green and all above a certain threshold to avoid dark colors
    const r = Math.floor(random() * 150) + 85;
    const g = Math.floor(random() * 200) + 45;
    const b = Math.floor(random() * 100) + 135;

    return [r, g, b];
}


export default class Bus{
    public destination:string;
    public line:string;
    public arrivalTime:Date;
    public ID:string
    public timeToStation:number
    public color: [number, number, number]

    public constructor(_destination:string,_line:string,_arrivalTime:string,_ID:string,_TTS:number){
        this.destination = _destination;
        this.line = _line;
        this.arrivalTime = new Date(_arrivalTime);
        this.ID = _ID;
        this.timeToStation = _TTS
        const rgbValues = getRgbFromInputString(_line);
        this.color = rgbValues
    }

    
}