import { Memory } from "./memory";

export class ROM extends Memory {
    constructor(bytes: Uint8Array){
        super(bytes.length, bytes);
    }

    public override write(value: number, address : number){
        throw new Error("Did you just try to write to a ROM? Read-only memory? What is wrong with you? Why would you do that?");
    }
}