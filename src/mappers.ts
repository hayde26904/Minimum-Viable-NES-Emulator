import { Mapper } from "./mapper";
import { ROM } from "./rom";

export class NROM extends Mapper {

    constructor(){
        super();
    }

    public override read(address: number): number {
        return this.rom.read(address -  0x8000);
    }
    public override write(value: number, address: number): void {
        
    }
}