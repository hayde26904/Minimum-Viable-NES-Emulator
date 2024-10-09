import { CPU } from "./cpu";
import { RAM } from "./ram";
import { ROM } from "./rom";

export class NES {
    private cpu: CPU;
    private ram: RAM;
    private currentPrgRom : ROM;

    constructor(){
        this.cpu = new CPU();
        this.ram = new RAM(2048);
        this.currentPrgRom = null;
    }

    public loadProgram(rom: ROM){
        this.cpu.reset();
        this.currentPrgRom = rom;
    }

    public step(){
        this.cpu.executeOperation(this.ram, this.currentPrgRom);
    }

}