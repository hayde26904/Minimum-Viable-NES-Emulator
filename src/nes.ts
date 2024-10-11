import { CPU } from "./cpu";
import { RAM } from "./ram";
import { ROM } from "./rom";
import { Util } from "./util";

export class NES {
    private cpu: CPU;
    private currentPrgRom : ROM;

    constructor(){
        this.cpu = new CPU();
        this.currentPrgRom = null;
    }

    public loadProgram(rom: ROM){

        this.cpu.reset();
        this.cpu.loadProgram(rom);

        this.currentPrgRom = rom;
    }

    public step(){
        this.cpu.executeOperation();
    }

}