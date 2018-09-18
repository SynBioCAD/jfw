

var lastMarkerId:number = 0;

export function getId():number {

    return ++ lastMarkerId;

}

export function reset():void {

    lastMarkerId = 0;

}

