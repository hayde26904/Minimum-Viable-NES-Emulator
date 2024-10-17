import { CPU } from "./cpu";
import { PPU } from "./ppu";
import { RAM } from "./ram";
import { ROM } from "./rom";
import { Util } from "./util";
import * as headerParser from "./headerParser";

export class NES {
    private cpu: CPU;
    private ppu: PPU;
    private currentPrgRom : ROM;

    constructor(ctx : CanvasRenderingContext2D){
        this.cpu = new CPU();
        this.ppu = new PPU(ctx);
        this.currentPrgRom = null;
    }

    public loadProgram(rom: ROM){

        const romInfo = headerParser.parseiNES1(rom);
        const romBytes = rom.getMemory().slice(16);
        const prg = new ROM(romBytes.slice(0, romInfo.prgRomSize));
        const chr = new ROM(romBytes.slice(romInfo.prgRomSize, romBytes.length - 1))

        console.log(romInfo);
        console.log(Util.Uint8ArrayToHex(prg.getMemory()));

        this.cpu.reset();
        this.cpu.loadProgram(prg);
        this.ppu.loadCHR(chr);

        this.currentPrgRom = rom;

        this.ppu.draw();
    }

    public step(){
        this.cpu.executeOperation();
    }

}